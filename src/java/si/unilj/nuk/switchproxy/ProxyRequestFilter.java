/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package si.unilj.nuk.switchproxy;

import java.util.Hashtable;
import java.util.Queue;
import java.util.concurrent.SynchronousQueue;
import java.util.Vector;
import org.apache.log4j.Logger;

/**
 *
 * @author mitja
 */
public class ProxyRequestFilter {
	private final static Logger log = Logger.getLogger(ProxyRequestFilter.class);
	
	private Vector<UrlMatchRule> ruleSet = new Vector<UrlMatchRule>();
	private Queue<RenderTask> taskQueue = new SynchronousQueue<RenderTask>();
	private Hashtable<String, RenderTask> activeTasks = new Hashtable<String, RenderTask>();

	public Vector<UrlMatchRule> getRuleSet() {
		return ruleSet;
	}

	public Queue<RenderTask> getTaskQueue() {
		return taskQueue;
	}
	
	
	// -- Proxy interface -------------------------------------------------------
	
	/**
	 * Tries to match the url with ruleset patterns.
	 * If matched then url is store to task queue and thread suspended until,
	 * remote renderer doesn't fetch task-url, renders it and returns it renderer
	 * DOM back.
	 * 
	 * @param url
	 * @return 
	 */
	public RenderTask match(String url) {
		for(UrlMatchRule r : ruleSet) {
			if(r.isMatched(url)) {
				return process(url, r);
			}
		}
		
		return null;
	}
	
	/**
	 * Do the actual work.
	 * 
	 * TODO, enclose to a separate type
	 * @param url 
	 */
	public RenderTask process(String url, UrlMatchRule rule) {
		RenderTask task = new RenderTask(url, rule);
		taskQueue.add(task);
		
		while(true) {
			try {
				log.info(String.format("Url processing .. %s", url));
				Thread.currentThread().wait();
			}
			catch(InterruptedException e) {
				log.info(String.format("Url preoce .. %s", url));
			}
			
			if(task.isComplete()) {
				activeTasks.remove(task.getId());
				return task;
			}
		}
		
		
	}
	
	// -- Renderer interface ----------------------------------------------------
	
	public RenderTask nextTask() {
		RenderTask task = taskQueue.poll();
		activeTasks.put(task.getId(), task);
		
		return task;
	}
	
	/**
	 * TODO headers
	 * @param id
	 * @param content 
	 */
	public void passContent(String id, String content) {
		activeTasks.get(id).setContent(content);
		
		// resume all waiting threads
		notifyAll();
	}
	
}