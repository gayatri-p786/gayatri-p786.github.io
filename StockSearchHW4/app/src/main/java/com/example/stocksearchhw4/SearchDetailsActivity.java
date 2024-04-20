package com.example.stocksearchhw4;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatImageButton;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import android.content.SharedPreferences;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class SearchDetailsActivity extends AppCompatActivity implements NewsAdapter.NewsItemClickListener{

    private ProgressBar progressBar;

    private TextView headingSymbol;

    private TabLayout tabLayout;

    private ViewPager viewPager;

    private TextView symbolTextView;
    private TextView currentPriceTextView;
    private TextView companyNameTextView;
    private LinearLayout topBar;

    private LinearLayout chartFragmentContainer;

    private LinearLayout tabs;

    private LinearLayout portSection;

    private LinearLayout statsSection;
    private LinearLayout aboutSection;

    private LinearLayout insightSection;

    private LinearLayout recChart;

    private LinearLayout earnChart;

    private LinearLayout newsSection;
    private TextView priceTextView;
    private TextView priceChangeTextView;

    private ImageView arrowImageView;

    String historicalDataString;

    String polygonDataString;

    Boolean linecolour;

    private RecyclerView newsRecyclerView;
    private NewsAdapter newsAdapter;

    private static final String BASE_URL = "https://stock-search-g-service-iigicr37lq-wm.a.run.app/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_search_details);

        progressBar = findViewById(R.id.progressBar);
        topBar = findViewById(R.id.topBar);
        headingSymbol = findViewById(R.id.tickerTextView);
        symbolTextView = findViewById(R.id.symbolTextView);
        currentPriceTextView = findViewById(R.id.currentPriceTextView);
        companyNameTextView = findViewById(R.id.companyNameTextView);
        priceTextView = findViewById(R.id.currentPriceTextView);
        priceChangeTextView = findViewById(R.id.priceChangeTextView);
        arrowImageView = findViewById(R.id.arrowImageView);
        viewPager = findViewById(R.id.viewPager);
        tabLayout = findViewById(R.id.tabLayout);
        chartFragmentContainer = findViewById(R.id.chart);
        tabs=findViewById(R.id.tabs);
        portSection=findViewById(R.id.portSection);
        statsSection=findViewById(R.id.statsSection);
        aboutSection=findViewById(R.id.aboutSection);
        insightSection=findViewById(R.id.insightSection);
        recChart=findViewById(R.id.recChart);
        earnChart=findViewById(R.id.earningChart);
        newsSection=findViewById(R.id.newsSection);
        // Create an adapter for the ViewPager

        // Retrieve ticker symbol from SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        String searchTicker = sharedPreferences.getString("searchTicker", "");


//        System.out.println("from shared"+ searchTicker);
        // Call API to fetch data using the retrieved ticker symbol
        fetchData(searchTicker);
    }

    private void fetchData(String searchTicker) {
//        System.out.println("search Ticker" +searchTicker);
        // Show progress bar while fetching data
        progressBar.setVisibility(View.VISIBLE);

        // Make API call to fetch data for the provided ticker symbol
        String apiUrl = BASE_URL + "api/data?ticker=" + searchTicker;
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
                (Request.Method.GET, apiUrl, null, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // Handle API response
                        progressBar.setVisibility(View.GONE); // Hide progress bar

                        try {
                            // Parse the JSON response and display the sections
                            // Update UI with the fetched data

                            displaySections(response);
                        } catch (JSONException e) {
                            e.printStackTrace();
                            // Show error message if unable to parse JSON
                            Toast.makeText(SearchDetailsActivity.this, "Error parsing JSON response", Toast.LENGTH_SHORT).show();
                        }
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // Handle error response
                        progressBar.setVisibility(View.GONE); // Hide progress bar
                        // Show error message
                        Toast.makeText(SearchDetailsActivity.this, "Error fetching data", Toast.LENGTH_SHORT).show();
                    }
                });

        // Add the request to the RequestQueue.
        Volley.newRequestQueue(this).add(jsonObjectRequest);
    }

    private void displaySections(JSONObject responseData) throws JSONException {
        // Update UI to display sections using the fetched data
        // For example, show ViewPager and TabLayout
        System.out.println("inside displaySections");
//        System.out.println("in display"+responseData.getJSONObject("profileData").getString("ticker"));
        JSONObject profileData = responseData.getJSONObject("profileData");
//        JSONObject peersData = responseData.getJSONObject("peersData");
        JSONObject latestPriceData = responseData.getJSONObject("latestPriceData");
        JSONObject historicalData = responseData.getJSONObject("historicalData");
        historicalDataString = historicalData.toString();
        JSONObject polygonData = responseData.getJSONObject("polygonData");
        polygonDataString = polygonData.toString();

        String ticker = profileData.getString("ticker");
        String company = profileData.getString("name");
        String c = "$ " + latestPriceData.getString("c");
        String d = "$ " + latestPriceData.getString("d");
        String dp = " (" + latestPriceData.getString("dp") + " %)";
        topBar.setVisibility(View.VISIBLE);
        headingSymbol.setText(ticker);
        companyNameTextView.setText(company);
        currentPriceTextView.setText(c);
        symbolTextView.setText(ticker);
        priceTextView.setText(c);
        String priceChangeText = d + dp;
        priceChangeTextView.setText(priceChangeText);
        double priceChange = latestPriceData.getDouble("d");
        // Set arrow image based on condition
        if (priceChange > 0) {
            // Positive change: Show up arrow
            linecolour = true;
            arrowImageView.setImageResource(R.drawable.trending_up);
            arrowImageView.setColorFilter(ContextCompat.getColor(this, R.color.green));
            priceChangeTextView.setTextColor(ContextCompat.getColor(this, R.color.green));
        } else if (priceChange < 0) {
            // Negative change: Show down arrow
            linecolour = false;
            arrowImageView.setImageResource(R.drawable.trending_down);
            arrowImageView.setColorFilter(ContextCompat.getColor(this, R.color.red));
            priceChangeTextView.setTextColor(ContextCompat.getColor(this, R.color.red));
        } else {
            // No change: Hide the arrow and set text color to black
            arrowImageView.setVisibility(View.GONE);
            priceChangeTextView.setTextColor(ContextCompat.getColor(this, R.color.black));
        }
        System.out.println("API fetching done");
        System.out.println(linecolour + polygonDataString + historicalDataString);
        tabs.setVisibility(View.VISIBLE);
        chartFragmentContainer.setVisibility(View.VISIBLE);
        PagerAdapter adapter = new PagerAdapter(getSupportFragmentManager(), this);
        viewPager.setAdapter(adapter);

        int[] tabIcons = {
                R.drawable.chart_hour, // Icon for the first tab
                R.drawable.chart_historical  // Icon for the second tab
        };
        // Connect the ViewPager to the TabLayout
        tabLayout.setupWithViewPager(viewPager);
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            if (tab != null) {
                // Set the icon for the tab
                tab.setIcon(tabIcons[i]);
            }
        }

        fetchDataFromPortfolio(ticker,latestPriceData.getDouble("c"));
        fetchQuoteDataFromAPI(ticker);

        TextView ipoStartDateTextView = findViewById(R.id.ipoStartDateTextView);
        TextView industryTextView = findViewById(R.id.industryTextView);
        TextView webpageTextView = findViewById(R.id.webpageTextView);
        ipoStartDateTextView.setText(profileData.getString("ipo"));
        industryTextView.setText(profileData.getString("finnhubIndustry"));
        webpageTextView.setText(profileData.getString("weburl"));
        webpageTextView.setOnClickListener(v -> {
            // Get the URL from the TextView
            String url = ((TextView) v).getText().toString();
            System.out.println("url="+url);

            // Create an Intent to open a web browser
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
        });


        aboutSection.setVisibility(View.VISIBLE);
        List<String> peersList = new ArrayList<>();
        JSONArray peersData = responseData.getJSONArray("peersData");
        for (int i = 0; i < peersData.length(); i++) {
            peersList.add(peersData.getString(i));
        }

        RecyclerView peersRecyclerView = findViewById(R.id.peersRecyclerView);
        PeersAdapter peerAdapter = new PeersAdapter(peersList);
        peersRecyclerView.setAdapter(peerAdapter);
        peersRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false));



        JSONObject sentimentData = responseData.getJSONObject("sentimentData");

        // Now you can access the "data" array inside the sentimentData object
        JSONArray dataArray = sentimentData.getJSONArray("data");

        // Perform calculations on the data array
        double totalMspr = 0;
        double totalChange = 0;
        double positiveMspr = 0;
        double negativeMspr = 0;
        double positiveChange = 0;
        double negativeChange = 0;

        for (int i = 0; i < dataArray.length(); i++) {
            JSONObject sentiment = dataArray.getJSONObject(i);

            double mspr = sentiment.getDouble("mspr");
            double change = sentiment.getDouble("change");

            totalMspr += mspr;
            totalChange += change;

            if (mspr > 0) {
                positiveMspr += mspr;
            } else if (mspr < 0) {
                negativeMspr += mspr;
            }

            if (change > 0) {
                positiveChange += change;
            } else if (change < 0) {
                negativeChange += change;
            }
        }

        DecimalFormat decimalFormat = new DecimalFormat("#0.00");

        // Find the TextViews corresponding to each cell
        TextView tableCompanyName = findViewById(R.id.tableCompanyName);
        TextView totalValueTextView = findViewById(R.id.totalValue);
        TextView totalChangeTextView = findViewById(R.id.totalChange);
        TextView positiveValueTextView = findViewById(R.id.positiveValue);
        TextView positiveChangeTextView = findViewById(R.id.positiveChange);
        TextView negativeValueTextView = findViewById(R.id.negativeValue);
        TextView negativeChangeTextView = findViewById(R.id.negativeChange);

        // Format the calculated values to two decimal places
        String totalMsprFormatted = decimalFormat.format(totalMspr);
        String totalChangeFormatted = decimalFormat.format(totalChange);
        String positiveMsprFormatted = decimalFormat.format(positiveMspr);
        String positiveChangeFormatted = decimalFormat.format(positiveChange);
        String negativeMsprFormatted = decimalFormat.format(negativeMspr);
        String negativeChangeFormatted = decimalFormat.format(negativeChange);

        // Set the formatted values in the respective TextViews
        tableCompanyName.setText(company);
        totalValueTextView.setText(totalMsprFormatted);
        totalChangeTextView.setText(totalChangeFormatted);
        positiveValueTextView.setText(positiveMsprFormatted);
        positiveChangeTextView.setText(positiveChangeFormatted);
        negativeValueTextView.setText(negativeMsprFormatted);
        negativeChangeTextView.setText(negativeChangeFormatted);
        insightSection.setVisibility(View.VISIBLE);

        JSONArray recommendationData =responseData.getJSONArray("recommendationData");


        String recommendationDataString = recommendationData.toString();
        System.out.println("recData"+recommendationDataString);
        // Get the support FragmentManager
        FragmentManager fragmentManager = getSupportFragmentManager();

// Begin a transaction to add the fragment
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();

// Create an instance of RecommendationChartFragment with the recommendation data
        RecChartFragment recommendationFragment = RecChartFragment.newInstance(recommendationDataString);

// Replace whatever is in the recChartContainer with the recommendation fragment
        fragmentTransaction.replace(R.id.recChartContainer, recommendationFragment);

// Commit the transaction
        fragmentTransaction.commit();
        recChart.setVisibility(View.VISIBLE);

        JSONArray earningData =responseData.getJSONArray("earningsData");

        String earningDataString = earningData.toString();
        System.out.println("earnData"+earningDataString);
        // Get the support FragmentManager
        FragmentManager earnfragmentManager = getSupportFragmentManager();

// Begin a transaction to add the fragment
        FragmentTransaction earnfragmentTransaction = earnfragmentManager.beginTransaction();

// Create an instance of RecommendationChartFragment with the recommendation data
        EarnChartFragment earnFragment = EarnChartFragment.newInstance(earningDataString);

// Replace whatever is in the recChartContainer with the recommendation fragment
        earnfragmentTransaction.replace(R.id.earnChartContainer, earnFragment);

// Commit the transaction
        earnfragmentTransaction.commit();
        earnChart.setVisibility(View.VISIBLE);


        JSONArray newsData =responseData.getJSONArray("newsData");
        // Initialize a new JSONArray to store filtered news data
        JSONArray filteredNewsData = new JSONArray();

// Loop through the newsData JSONArray
        for (int i = 0; i < newsData.length(); i++) {
            try {
                JSONObject newsItem = newsData.getJSONObject(i);
                // Check if the image key is not empty
                if (newsItem.has("image") && !newsItem.isNull("image")) {
                    String imageUrl = newsItem.getString("image");
                    if (!TextUtils.isEmpty(imageUrl)) {
                        // Add the news item to the filtered array
                        filteredNewsData.put(newsItem);
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

// Ensure that we have a maximum of 20 items in the filtered array
        int maxItems = Math.min(filteredNewsData.length(), 20);

// Create a new JSONArray to store the top 20 items
        JSONArray topNewsData = new JSONArray();

// Add the top 20 items to the new JSONArray
        for (int i = 0; i < maxItems; i++) {
            try {
                topNewsData.put(filteredNewsData.getJSONObject(i));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

// Now topNewsData contains the filtered news data with a maximum of 20 items, each with a non-empty image URL

        newsRecyclerView = findViewById(R.id.newsRecyclerView);
        newsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        newsAdapter = new NewsAdapter(this, topNewsData, this);
        // Set adapter to RecyclerView
        newsRecyclerView.setAdapter(newsAdapter);

        newsSection.setVisibility(View.VISIBLE);


    }

    @Override
    public void onNewsItemClick(JSONObject newsItem) {
        // Display the news dialog here
        showNewsDialog(newsItem);
    }

    private void showNewsDialog(JSONObject newsItem) {
        // Create and customize the dialog
        AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.RoundedDialogTheme);
//        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        View dialogView = getLayoutInflater().inflate(R.layout.news_article_dialog, null);

        // Find views in the dialog layout
        TextView sourceTextView = dialogView.findViewById(R.id.dialog_news_source);
        TextView publishedDateTextView = dialogView.findViewById(R.id.dialog_news_published_date);
        TextView titleTextView = dialogView.findViewById(R.id.dialog_news_title);
        TextView descriptionTextView = dialogView.findViewById(R.id.dialog_news_description);
        AppCompatImageButton chromeButton = (AppCompatImageButton) dialogView.findViewById(R.id.button_chrome);
        AppCompatImageButton twitterButton = (AppCompatImageButton) dialogView.findViewById(R.id.button_twitter);
        AppCompatImageButton facebookButton = (AppCompatImageButton) dialogView.findViewById(R.id.button_facebook);

        try {
            // Populate dialog views with data from newsItem
            sourceTextView.setText(newsItem.getString("source"));
            // Set published date in the format: Month dd, yyyy
            SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault());
            long datetime = newsItem.getLong("datetime") * 1000; // Convert seconds to milliseconds
            String publishedDate = dateFormat.format(new Date(datetime));
            publishedDateTextView.setText(publishedDate);
            titleTextView.setText(newsItem.getString("headline"));
            descriptionTextView.setText(newsItem.getString("summary"));

            // Set click listeners for buttons
            chromeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    try {
                        // Open the article in Chrome
                        // Replace "article_url" with the actual key for the article URL in your JSON object
                        String articleUrl = newsItem.getString("url");
                        openInChrome(articleUrl);
                    }catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });

            twitterButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    try {
                        // Share the article on Twitter
                        String articleUrl = newsItem.getString("url");
                        shareOnTwitter(articleUrl);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });

            facebookButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    try {
                        // Share the article on Facebook
                        String articleUrl = newsItem.getString("url");
                        shareOnFacebook(articleUrl);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            });

            // Similar listeners for twitterButton and facebookButton

        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Set the custom view for the dialog and show it
        builder.setView(dialogView);
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void openInChrome(String articleUrl) {
        // Logic to open the article in Chrome
        // You can use intents to open URLs in external browsers
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(articleUrl));
        startActivity(intent);
    }

    private void shareOnTwitter(String articleUrl) {
        try {
            // Append additional text to the URL
            String tweetText = "Check out this article: " + articleUrl;
            // Encode the tweet text to be URL-safe
            String encodedTweetText = URLEncoder.encode(tweetText, "UTF-8");

            // Construct the URL for sharing on Twitter with the encoded tweet text
            String twitterUrl = "https://twitter.com/intent/tweet?text=" + encodedTweetText;

            // Open the URL in Chrome or the Twitter app
            openInChrome(twitterUrl);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    private void shareOnFacebook(String articleUrl) {
        // You need to implement logic to open Facebook and post the article URL
        // Here, I'm opening the URL in Chrome as an example
        openInChrome("https://www.facebook.com/sharer/sharer.php?u=" + articleUrl);
    }

    private void fetchDataFromPortfolio(String ticker, Double current) {
        // Show progress bar
//        progressBar.setVisibility(View.VISIBLE);
        String url = BASE_URL + "api/user/portfolio";
        System.out.println("Inside portfolio fetching");
        TextView numberOfStocksTextView = findViewById(R.id.numberOfStocks);
        TextView avgCostPerShareTextView = findViewById(R.id.avgCostPerShare);
        TextView totalCostOfSharesOwnedTextView = findViewById(R.id.totalCostOfSharesOwned);
        TextView changeInPriceTextView = findViewById(R.id.changeInPrice);
        TextView marketValueTextView = findViewById(R.id.marketValue);
        System.out.println("inside portfolio"+ticker+current);

        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
//                    System.out.println("Inside Response");
                    // Process the portfolio data
                    try {

                        // Parse the JSON response
                        JSONArray portfolioArray = response.getJSONArray("portfolio");
                        System.out.println("inside response try"+portfolioArray);

                        // Loop through the portfolio items
                        for (int i = 0; i < portfolioArray.length(); i++) {
                            JSONObject stockJson = portfolioArray.getJSONObject(i);

                            // Extract fields for the symbol that matches searchTicker
                            String symbol = stockJson.getString("symbol");
                            System.out.println("symbol"+symbol);
                            if (symbol.equals(ticker)) {
                                System.out.println("inside if");
                                double quantity = stockJson.getInt("quantity");
                                double total = stockJson.getDouble("total");
                                double averageCostPerShare = stockJson.getDouble("averageCostPerShare");
                                double marketValue = quantity*current;

                                // Set these values to TextViews
                                String quant = "Shares Owned:"+String.format("%.2f",quantity);
                                String avgcost = "Avg Cost/Share: $"+String.format("%.2f",averageCostPerShare);
                                String totalcost = "Total Cost: $"+String.format("%.2f",total);
                                String mv = "Market Value: $"+String.format("%.2f",marketValue);
                                double change=total-marketValue;
                                String changetext= "Change:"+String.format("%.2f",change);

                                System.out.println(quant);
                                System.out.print(avgcost);
                                numberOfStocksTextView.setText(quant);
                                avgCostPerShareTextView.setText(avgcost);
                                totalCostOfSharesOwnedTextView.setText(totalcost);
                                changeInPriceTextView.setText(changetext);
                                marketValueTextView.setText(mv);
                                if (current<averageCostPerShare){
                                    changeInPriceTextView.setTextColor(ContextCompat.getColor(this, R.color.red));
                                    marketValueTextView.setTextColor(ContextCompat.getColor(this, R.color.red));
                                }else{
                                    changeInPriceTextView.setTextColor(ContextCompat.getColor(this, R.color.green));
                                    marketValueTextView.setTextColor(ContextCompat.getColor(this, R.color.green));
                                }

                                // Break out of the loop since we found the matching symbol
                                break;

                            }

                        }
                        portSection.setVisibility(View.VISIBLE);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                },
                error -> {
                    // Handle error (network failure or server error)
                    System.out.println(error);
                });

        VolleySingleton.getInstance(this).addToRequestQueue(request);

        // Hide progress bar when done
//        progressBar.setVisibility(View.GONE);
    }

    private void fetchQuoteDataFromAPI(String ticker) {
        // Perform API call to fetch data from baseurl/api/profiledata?ticker=${ticker}
        // Update the UI with the fetched data
        String url = BASE_URL + "api/profiledata?ticker=" + ticker;

        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    try {
                        JSONObject data = response.getJSONObject("data");

                        // Extract data from the JSON object
                        double highPrice = data.getDouble("h");
                        double lowPrice = data.getDouble("l");
                        double openPrice = data.getDouble("o");
                        double previousClose = data.getDouble("pc");

                        // Find the TextViews for each stat
                        TextView openPriceTextView = findViewById(R.id.openPriceTextView);
                        TextView lowPriceTextView = findViewById(R.id.lowPriceTextView);
                        TextView highPriceTextView = findViewById(R.id.highPriceTextView);
                        TextView prevCloseTextView = findViewById(R.id.prevCloseTextView);

// Set values for each TextView
                        openPriceTextView.setText("Open Price: $" + openPrice);
                        lowPriceTextView.setText("Low Price: $" + lowPrice);
                        highPriceTextView.setText("High Price: $" + highPrice);
                        prevCloseTextView.setText("Prev. Close: $" + previousClose);

                        statsSection.setVisibility(View.VISIBLE);



                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.e("API_ERROR", "Error parsing JSON response for " + ticker + ": " + e.toString());
                    }
                },
                error -> {
                    // Handle error
                    Log.e("API_ERROR", "Error fetching data for " + ticker + ": " + error.toString());
                });

        VolleySingleton.getInstance(this).addToRequestQueue(request);
    }


private class PagerAdapter extends FragmentPagerAdapter {
    private final int[] tabIcons = new int[]{R.drawable.chart_hour, R.drawable.chart_historical}; // Resource IDs for tab icons
    private Context context;
    public PagerAdapter(@NonNull FragmentManager fm,  Context context) {
        super(fm);
        this.context = context;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        // Return the appropriate Fragment based on the tab position
        switch (position) {
            case 0:
                return ChartFragment.newInstance(0, polygonDataString, linecolour);
            case 1:
                return ChartFragment.newInstance(1, historicalDataString, linecolour);
            default:
                return null;
        }
    }

    @Override
    public int getCount() {
        return tabIcons.length;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        // Return null to indicate that the tab titles should be set with icons instead of text
        return null;
    }

}
}