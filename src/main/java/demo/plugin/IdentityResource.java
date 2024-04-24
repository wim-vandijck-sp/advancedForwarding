package demo.plugin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import sailpoint.api.SailPointContext;
import sailpoint.rest.plugin.AllowAll;
import sailpoint.rest.plugin.BasePluginResource;
import sailpoint.tools.GeneralException;

@Path("iiqorgchartplugindemo")
@AllowAll
public class IdentityResource extends BasePluginResource {
	
	@GET
	@Path("orgchart/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public ResponseEntity<Map<String, Object>> getOrgChart(@PathParam("id") final String id) throws GeneralException {
		SailPointContext context = this.getContext();
		HttpStatus responseStatus = HttpStatus.OK;
		String message = null;
		List<Map<String, Object>> nodes = null;
		nodes = null; //IdentityService.getTreeNodes(context, id);
		Map<String, Object> responseBody = new HashMap<String, Object>();
		responseBody.put("nodes", nodes);
		responseBody.put("message", message);
		return ResponseEntity.status(responseStatus).body(responseBody);
	}
	
	@Override
	public String getPluginName() {
		// return PluginSettingService.getPluginName();
		return "myPlugin";
	}

}
