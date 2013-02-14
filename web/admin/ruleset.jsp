<%@page import="java.util.Locale.Builder"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="org.apache.commons.io.FileUtils"%>
<%@page import="javax.xml.XMLConstants"%>
<%@page import="nu.xom.Attribute"%>
<%@page import="nu.xom.Text"%>
<%@page import="nu.xom.Document"%>
<%@page import="nu.xom.Serializer"%>
<%@page import="nu.xom.Element"%>
<%@page import="java.util.Vector"%>
<%@page import="si.unilj.nuk.switchproxy.UrlMatchRule"%>
<%@page import="si.unilj.nuk.switchproxy.ProxyRequestFilterSingleton"%>
<%@page import="com.sun.jmx.remote.internal.ProxyRef"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
	
	Vector<UrlMatchRule> ruleSet = ProxyRequestFilterSingleton.getInstance().getRuleSet();

	if("add".equals(request.getParameter("action"))) {
		ruleSet.add(new UrlMatchRule(request.getParameter("urlpattern"), request.getParameter("script")));
	}
	else if("remove".equals(request.getParameter("action"))) {
		ruleSet.remove(Integer.parseInt(request.getParameter("index")));
	}
	else if("store".equals(request.getParameter("action"))) {
		Element xRuleset = new Element("ruleset");
		Document doc = new Document(xRuleset);
		
			for(UrlMatchRule r : ruleSet) {
			Element xRule = new Element("rule");
			xRuleset.appendChild(xRule);
			
				Element xUrlPattern = new Element("url-pattern");
				xRule.appendChild(xUrlPattern);
				
					xUrlPattern.appendChild(r.getUrlPattern().toString());
					
				Element xClientScript = new Element("client-script");
				xRule.appendChild(xClientScript);
				
					xClientScript.appendChild(new Text(r.getClientScript()));
					xClientScript.addAttribute(new Attribute("xml:space", XMLConstants.XML_NS_URI, "preserve"));
			}
		
	
			
			
		Serializer serializer = new Serializer(
			new FileOutputStream(pageContext.getServletContext().getRealPath("WEB-INF/ruleset.xml"), false),
			"UTF-8");
		serializer.setIndent(3);
		serializer.setLineSeparator("\r\n");
		serializer.write(doc);
		serializer.flush();			
	
		response.sendRedirect("ruleset.jsp");
	}

%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>JSP Page</title>
	</head>
	<body>
		<table border="1" cellspacing="0">
			<thead>
				<tr>
					<th></th>
					<th>Url pattern</th>
					<th>Script</th>
				</tr>
			</thead>
			<tbody>
				<%
					
					int idx = 0;
					for(UrlMatchRule r : ruleSet) {
						%>
						<tr>
							<td><a href="?action=remove&index=<%=idx++%>">Remove</a></td>
							<td><%=r.getUrlPattern().toString() %></td>
							<td><pre><%=r.getClientScript() %></pre></td>
						</tr>						
						<%
					}
					
				%>
			</tbody>
		</table>
		<hr>
		<form action="?action=add" method="post">
			Url pattern <input name="urlpattern" type="text"><br>
			Script:<br>
			<textarea cols="100" rows="10" name="script"></textarea><br>
			<input type="submit">
		</form>
		<hr>
		<button onclick="location.href='?action=store'">Save</button>
		<button onclick="location.href='?action=load'">Load</button>
	</body>
</html>
