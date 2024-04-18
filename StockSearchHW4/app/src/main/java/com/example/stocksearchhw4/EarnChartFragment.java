package com.example.stocksearchhw4;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.fragment.app.Fragment;

public class EarnChartFragment extends Fragment {

    private static final String ARG_EARNINGS_DATA = "earningsData";

    private String earningsData;

    public static EarnChartFragment newInstance(String earningsData) {
        EarnChartFragment fragment = new EarnChartFragment();
        Bundle args = new Bundle();
        args.putString(ARG_EARNINGS_DATA, earningsData);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            earningsData = getArguments().getString(ARG_EARNINGS_DATA);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.earning_chart_layout, container, false);

        // Find the WebView in the inflated layout
        WebView webView = rootView.findViewById(R.id.earn_chartWebView);

        // Enable JavaScript for the WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load HTML file for earning chart
        webView.loadUrl("file:///android_asset/earning_chart.html");

        // Inject JavaScript to pass earningsData to the WebView
        webView.addJavascriptInterface(new WebAppInterface(requireContext(), earningsData), "Android");

        return rootView;
    }

    public class WebAppInterface {
        private Context mContext;
        private String mEarningsData;

        public WebAppInterface(Context context, String earningsData) {
            mContext = context;
            mEarningsData = earningsData;
        }

        @JavascriptInterface
        public String getEarningData() {
            return mEarningsData;
        }
    }
}

