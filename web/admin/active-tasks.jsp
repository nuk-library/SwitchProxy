<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Map.Entry"%>
<%@page import="si.unilj.nuk.switchproxy.RenderTask"%>
<%@page import="java.util.Hashtable"%>
<%@page import="si.unilj.nuk.switchproxy.ProxyRequestFilterSingleton"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%

	if("cancel".equals(request.getParameter("action"))) {
		HashMap<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "text/html");
		headers.put("Transfer-Encoding", "chunked");
		
		ProxyRequestFilterSingleton.getInstance().passContent(request.getParameter("uuid"), "Canceled!!", headers);
		
		response.sendRedirect("active-tasks.jsp");
	}
	
%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>JSP Page</title>
	</head>
	<body>
		<table width="100%" cellpadding="10" border="1" cellspacing="0">
			<thead>
				<tr>
					<th witdh="200">UUID</th>
					<th>Task description</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<%

					Hashtable<String, RenderTask> hs = ProxyRequestFilterSingleton.getInstance().getActiveTasks();
					for(Map.Entry e : hs.entrySet()) {
						%>
						<tr>
							<td><%= e.getKey()%></td>
							<td><%= e.getValue()%></td>
							<td><a href="?action=cancel&uuid=<%= e.getKey()%>">Cancel</a></td>
						</tr>
						<%
					}

				%>
			</tbody>
		</table>
	</body>
</html>
