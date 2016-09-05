package com.xinlaihome.smartconfig;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Random;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaPreferences;
import org.json.JSONException;
import org.json.JSONObject;

import android.os.Handler;
import android.os.Message;
import android.view.View;
import android.widget.Toast;

import com.integrity_project.smartconfiglib.FirstTimeConfig;
import com.integrity_project.smartconfiglib.FirstTimeConfigListener;


public class SmartConfigPlugin extends CordovaPlugin {
	CC3XWifiManager mCC3XWifiManager = null;
	FirstTimeConfig firstConfig = null;
	CallbackContext callbackContextThis;
	
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);   
    }
	public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) 
            throws JSONException{
		callbackContextThis = callbackContext;            	
		System.out.print("execute was called!!!");
		if(action.equals("cordovaSendData")){
			cordovaSendData(args);
			return true;			
		}
		else{
			callbackContextThis.error("cordovaSendData calling fail");
			return false;
		}

	}
	public void cordovaSendData(CordovaArgs args){
		try 
		{
			JSONObject ipobj = args.getJSONObject(0);
			String ssid = ipobj.getString("ssid");
			String pw = ipobj.getString("pw");
			String gw = ipobj.getString("gw");

			firstConfig = getFirstTimeConfigInstance(new CC3XApiManager(), ssid, pw, gw);
			firstConfig.transmitSettings();

			callbackContextThis.success("cordovaSendData called");

		} catch (Exception e) 
		{
			callbackContextThis.success("cordovaSendData exception");
			//e.printStackTrace();
		}

	
	}
	
	public void cordovaStopSendingData(){
		
		
	}
	
	/**
	 * Returns the instance of FirstTimeConfig class which is further used to
	 * call startTransmission() to send the message to server.
	 * 
	 * @param apiListener
	 * @return instance of FirstTimeConfig with variying parameters to the
	 *         unique Constructor ie. Overloading of Constructor.
	 * @throws Exception
	 */
	private FirstTimeConfig getFirstTimeConfigInstance(FirstTimeConfigListener apiListener, String ssid, String pw, String gw) throws Exception 
	{
		String ssidFieldTxt = ssid;
		String passwdText = pw;
		String gateway = gw;
		String deviceInput = "CC3000";

		byte[] totalBytes = null;
		String keyInput = null;

		return new FirstTimeConfig(apiListener, passwdText, totalBytes,	gateway,
				ssidFieldTxt,deviceInput);
	}
	public CC3XWifiManager getWiFiManagerInstance() {
		return mCC3XWifiManager;
	}

}
