package com.codex.playground;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private Vibrator vibrator;
    
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
        
        setupWebView();
        
        String url = "http://localhost:5173";
        webView.loadUrl(url);
    }
    
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        
        webView.addJavascriptInterface(new WebAppInterface(), "Android");
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    return false;
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
            }
        });
    }
    
    public class WebAppInterface {
        
        @JavascriptInterface
        public void receiveMessage(String message) {
            try {
                JSONObject json = new JSONObject(message);
                String type = json.getString("type");
                JSONObject payload = json.optJSONObject("payload");
                String callbackId = json.optString("callbackId");
                
                handleWebMessage(type, payload, callbackId);
                
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        
        private void handleWebMessage(String type, JSONObject payload, String callbackId) {
            runOnUiThread(() -> {
                try {
                    switch (type) {
                        case "SHOW_TOAST":
                            String message = payload.getString("message");
                            Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                            sendResponse(callbackId, "success");
                            break;
                            
                        case "VIBRATE":
                            if (vibrator != null) {
                                vibrator.vibrate(100);
                            }
                            sendResponse(callbackId, "success");
                            break;
                            
                        case "OPEN_URL":
                            String url = payload.getString("url");
                            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                            startActivity(intent);
                            sendResponse(callbackId, "success");
                            break;
                            
                        case "SHARE":
                            String title = payload.getString("title");
                            String text = payload.getString("text");
                            String shareUrl = payload.optString("url", "");
                            
                            Intent shareIntent = new Intent(Intent.ACTION_SEND);
                            shareIntent.setType("text/plain");
                            shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);
                            shareIntent.putExtra(Intent.EXTRA_TEXT, text + " " + shareUrl);
                            startActivity(Intent.createChooser(shareIntent, "Share"));
                            sendResponse(callbackId, "success");
                            break;
                            
                        default:
                            sendResponse(callbackId, "unknown_command");
                            break;
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    sendResponse(callbackId, "error");
                }
            });
        }
        
        private void sendResponse(String callbackId, String response) {
            if (callbackId != null && !callbackId.isEmpty()) {
                String js = String.format(
                    "window.dispatchEvent(new CustomEvent('message', {detail: JSON.stringify({callbackId: '%s', payload: '%s'})}));",
                    callbackId, response
                );
                webView.evaluateJavascript(js, null);
            }
        }
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}