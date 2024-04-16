package com.example.stocksearchhw4;

import android.content.Context;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import org.json.JSONObject;

public class ChartFragment extends Fragment {

    private static final String ARG_POSITION = "position";
    private static final String ARG_HISTORICAL_DATA = "historicalData";

    private static final String ARG_Linecolor = "line_colour";
    private int position;
    private String historicalData;

    private Boolean linecolour;

    public static ChartFragment newInstance(int position, String historicalData, Boolean linecolour) {
        ChartFragment fragment = new ChartFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_POSITION, position);
        args.putString(ARG_HISTORICAL_DATA, historicalData);
        args.putBoolean(ARG_Linecolor, linecolour);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            position = getArguments().getInt(ARG_POSITION);
            historicalData = getArguments().getString(ARG_HISTORICAL_DATA);
            linecolour = getArguments().getBoolean(ARG_Linecolor);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.chart_fragment, container, false);

        // Find the WebView in the inflated layout
        WebView webView = rootView.findViewById(R.id.chartWebView);

        // Enable JavaScript for the WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load HTML file based on position

        String htmlFileName = position == 0 ? "hourly_chart.html" : "historical_chart.html";
        webView.loadUrl("file:///android_asset/" + htmlFileName);

        // Inject JavaScript to pass historicalData to the WebView
        // Determine the line color based on the isGreen flag
        String lineColor = linecolour ? "green" : "red";

        webView.addJavascriptInterface(new WebAppInterface(requireContext(), historicalData.toString(), lineColor), "Android");


// Inject JavaScript to pass historicalData and lineColor to the WebView
//        String javascript = "window.localStorage.setItem('historicalData', '" + historicalData.toString() + "');";
//        javascript += "window.localStorage.setItem('lineColor', '" + lineColor + "');";
//        webView.evaluateJavascript(javascript, null);


        return rootView;
    }

    public class WebAppInterface {
        private Context mContext;
        private String mHistoricalData;
        private String mLineColor;

        public WebAppInterface(Context context, String historicalData, String lineColor) {
            mContext = context;
            mHistoricalData = historicalData;
            mLineColor = lineColor;
        }

        @JavascriptInterface
        public String getHistoricalData() {
            System.out.println(mHistoricalData);
            return mHistoricalData;
        }

        @JavascriptInterface
        public String getLineColor() {
            return mLineColor;
        }
    }


}
