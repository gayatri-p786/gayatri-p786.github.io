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

public class RecChartFragment extends Fragment {

    private static final String ARG_RECOMMENDATION_DATA = "recommendationData";

    private String recommendationData;

    public static RecChartFragment newInstance(String recommendationData) {
        RecChartFragment fragment = new RecChartFragment();
        Bundle args = new Bundle();
        args.putString(ARG_RECOMMENDATION_DATA, recommendationData);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            recommendationData = getArguments().getString(ARG_RECOMMENDATION_DATA);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View rootView = inflater.inflate(R.layout.rec_chart_layout, container, false);

        // Find the WebView in the inflated layout
        WebView webView = rootView.findViewById(R.id.rec_chartWebView);

        // Enable JavaScript for the WebView
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load HTML file for recommendation chart
        webView.loadUrl("file:///android_asset/rec_chart.html");

        // Inject JavaScript to pass recommendationData to the WebView
        webView.addJavascriptInterface(new WebAppInterface(requireContext(), recommendationData), "Android");

        return rootView;
    }

    public class WebAppInterface {
        private Context mContext;
        private String mRecommendationData;

        public WebAppInterface(Context context, String recommendationData) {
            mContext = context;
            mRecommendationData = recommendationData;
        }

        @JavascriptInterface
        public String getRecommendationData() {
            return mRecommendationData;
        }
    }
}
