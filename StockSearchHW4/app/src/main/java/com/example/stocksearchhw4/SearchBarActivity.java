package com.example.stocksearchhw4;

import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Menu;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.CursorAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.SearchView;
import android.widget.SimpleCursorAdapter;
import android.widget.Space;
import android.widget.TextView;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.List;


public class SearchBarActivity extends AppCompatActivity implements SwipeToDeleteHelper.SwipeToDeleteListener  {

    private static final String BASE_URL = "https://stock-search-g-service-iigicr37lq-wm.a.run.app/";
    private static final String API_KEY = "cmuu051r01qru65i12s0cmuu051r01qru65i12sg";
    private ProgressBar progressBar;
    List<StockItem> watchlist = new ArrayList<>();
    List<PortfolioItem> portfolio = new ArrayList<>();
    StockItemAdapter stockItemAdapter = new StockItemAdapter(this, watchlist);
    PortfolioItemAdapter portfolioItemAdapter = new PortfolioItemAdapter(this, portfolio);
    private static boolean isMarketOpen = false;

    private static final long API_CALL_INTERVAL = 15000; // 15 seconds
    private boolean isPortfolioDataLoaded = false;
    private boolean isWatchlistDataLoaded = false;
    private Handler mHandler = new Handler(Looper.getMainLooper());

    private double currentPrice;
    private double priceChange;
    private double priceChangePercentage;
    private double highPrice;

    private TextView moneyTextView;
    private TextView balanceTextView;

    private LinearLayout portfolioSection;
    private LinearLayout favoriteSection;
    private List<String> suggestions = new ArrayList<>();

    private SearchView searchAutoCompleteTextView;
    private CursorAdapter adapter;

    private TextView textViewDate;
    private TextView footer;
    private double money;

    private double balance;
    private double lowPrice;
    private double openPrice;
    private double previousClose;

    private long timestamp;


    @Override
    protected void onResume() {
        super.onResume();
        // Start fetching data when the activity is resumed
        startFetchingData();
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Stop fetching data when the activity is paused to avoid unnecessary calls
        stopFetchingData();
    }


    private void stopFetchingData() {
        // Remove the scheduled runnable to stop fetching data
        mHandler.removeCallbacks(mRunnable);
    }

    public static void checkMarketStatusAndFetchData(Context context) {
        Calendar currentTime = Calendar.getInstance();
        int dayOfWeek = currentTime.get(Calendar.DAY_OF_WEEK);
        int hourOfDay = currentTime.get(Calendar.HOUR_OF_DAY);
        int minuteOfHour = currentTime.get(Calendar.MINUTE);

        // Check if it's a weekday and within market hours
        if (dayOfWeek >= Calendar.MONDAY && dayOfWeek <= Calendar.FRIDAY &&
                (hourOfDay > 9 || (hourOfDay == 9 && minuteOfHour >= 30)) &&
                hourOfDay < 16) { // Market open from 9:30 AM to 4:00 PM
            isMarketOpen = true;
        } else {
            isMarketOpen = false;
        }
    }


    public void PortfolioItemUpdate(int position) {
        // Update the PortfolioItem at the specified position with the calculated values
        double marketValue = currentPrice * portfolio.get(position).getQuantity();
        double changeFromTotalCost = (currentPrice - portfolio.get(position).getAverageCostPerShare())* portfolio.get(position).getQuantity();
        double totalCost = portfolio.get(position).getAverageCostPerShare() * portfolio.get(position).getQuantity();
        double changeFromTotalCostPercentage = (changeFromTotalCost / totalCost) * 100;

        PortfolioItem portfolioItem = portfolio.get(position);
        portfolioItem.marketValue = marketValue;
        portfolioItem.changeFromTotalCost=changeFromTotalCost;
        portfolioItem.changeFromTotalCostPercentage=changeFromTotalCostPercentage;

        // Notify the adapter that the data has changed
        portfolioItemAdapter.notifyItemChanged(position);
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
                        currentPrice = data.getDouble("c");
                        priceChange = data.getDouble("d");
                        priceChangePercentage = data.getDouble("dp");
                        highPrice = data.getDouble("h");
                        lowPrice = data.getDouble("l");
                        openPrice = data.getDouble("o");
                        previousClose = data.getDouble("pc");
                        timestamp = data.getLong("t");

                        // Print the fetched data along with the time it was fetched
                        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
                        String formattedTimestamp = dateFormat.format(new Date(timestamp * 1000)); // Convert timestamp to milliseconds
                        Log.i("FETCHED_DATA", "Fetched data for " + ticker + " at " + formattedTimestamp + ":");
                        Log.i("FETCHED_DATA", "Current Price: " + currentPrice);
                        Log.i("FETCHED_DATA", "Price Change: " + priceChange);
                        Log.i("FETCHED_DATA", "Price Change Percentage: " + priceChangePercentage);
                        Log.i("FETCHED_DATA", "High Price: " + highPrice);
                        Log.i("FETCHED_DATA", "Low Price: " + lowPrice);
                        Log.i("FETCHED_DATA", "Open Price: " + openPrice);
                        Log.i("FETCHED_DATA", "Previous Close: " + previousClose);
                        Log.i("FETCHED_DATA", "Timestamp: " + formattedTimestamp);

                        updateWatchlistandPortfolio();

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


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_search_bar);


        // Set the current date dynamically
        progressBar = findViewById(R.id.progressBar);
        textViewDate = findViewById(R.id.textViewDate);
        footer = findViewById(R.id.finnhubText);
        favoriteSection=findViewById(R.id.favoritesSection);
        moneyTextView = findViewById(R.id.money);
        balanceTextView = findViewById(R.id.balance);
        searchAutoCompleteTextView = findViewById(R.id.searchView);
        portfolioSection = findViewById(R.id.portfolioSection);
        String currentDate = getCurrentDate();


        checkMarketStatusAndFetchData(this);
        fetchDataFromApi1();

        textViewDate.setText(currentDate);
        textViewDate.setVisibility(View.VISIBLE);
        Space space = findViewById(R.id.space);
        TextView stocksTitle = findViewById(R.id.stocksTitle);


        String[] from = new String[]{"suggestion"};
        int[] to = new int[]{android.R.id.text1};

        adapter = new SimpleCursorAdapter(this,
                android.R.layout.simple_list_item_1,
                null,
                from,
                to,
                CursorAdapter.FLAG_REGISTER_CONTENT_OBSERVER);

//        SearchView searchView = findViewById(R.id.searchView);
        searchAutoCompleteTextView.setSuggestionsAdapter(adapter);

        searchAutoCompleteTextView.setOnClickListener(v -> {
            space.setVisibility(View.GONE);
            stocksTitle.setVisibility(View.GONE);
            ViewGroup.LayoutParams params = searchAutoCompleteTextView.getLayoutParams();
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            searchAutoCompleteTextView.setLayoutParams(params);
        });

        searchAutoCompleteTextView.setOnSuggestionListener(new SearchView.OnSuggestionListener() {
            @Override
            public boolean onSuggestionSelect(int position) {
                // Handle suggestion selection
                return true; // Return true if the event is consumed
            }

            @Override
            public boolean onSuggestionClick(int position) {
                // Handle suggestion click
                // Here you can get the suggestion text and perform your desired operation
                System.out.println("inside onSuggestionCLick");
                Cursor cursor = (Cursor) searchAutoCompleteTextView.getSuggestionsAdapter().getItem(position);
                if (cursor != null && cursor.getCount() > position) {
                    cursor.moveToPosition(position);
                    // Assuming your suggestion format is "symbol|description"
                    String suggestion = cursor.getString(1); // Assuming the suggestion is in the first column
                    System.out.println("suggestion "+suggestion);
                    if (suggestion != null) {
                        // Extract symbol and description from the suggestion
                        String[] parts = suggestion.split("\\|");
                        if (parts.length == 2) {
                            String symbol = parts[0];
                            String description = parts[1];
                            System.out.println("symbol"+symbol);
                            // Perform your desired operation with symbol and description
                            searchAutoCompleteTextView.setQuery(symbol, true);

                        }
                    }
                }
                return true; // Return true if the event is consumed
            }
        });


        searchAutoCompleteTextView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                // Handle search query submission
                System.out.println("inside onQuerySubmit");
                searchOrNavigate(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                // Update suggestions as the user types
                fetchSuggestions(newText);
                return true;
            }
        });
    }


    private void fetchSuggestions(String query) {
        String url = "https://finnhub.io/api/v1/search?q=" + query + "&token=" + API_KEY;
//        suggestions= Arrays.asList("AAPL | Apple Inc.", "GOOGL | Alphabet Inc.", "MSFT | Microsoft Corporation");
//        progressBar.setVisibility(View.VISIBLE);
//        System.out.println(suggestions);
//        updateSuggestions(suggestions);
        JsonObjectRequest  request = new JsonObjectRequest (Request.Method.GET, url, null,
                response -> {
            System.out.println("Inside response for suggestion");
                    suggestions = new ArrayList<>();
                    try {
                        JSONArray resultArray = response.getJSONArray("result");
                        MatrixCursor cursor = new MatrixCursor(new String[]{"_id", "suggestion"});

                        for (int i = 0; i < resultArray.length(); i++) {
                            JSONObject suggestionObject = resultArray.getJSONObject(i);
                            String type = suggestionObject.getString("type");
                            String description = suggestionObject.getString("description");
                            String symbol = suggestionObject.getString("symbol");


                            if (type.equals("Common Stock") && !description.contains(".") && !symbol.contains(".")) {
                                cursor.addRow(new Object[]{i, symbol + " |" + description});
                            }
                        }
                        System.out.println(suggestions);
//                        updateSuggestions(suggestions);
                        updateSuggestions(cursor);

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                },
                error -> {
                    // Handle error
                    System.out.println(error);
                });
//        adapter.clear();
        Volley.newRequestQueue(this).add(request);
    }



private void updateSuggestions(MatrixCursor cursor) {
    // Update the SimpleCursorAdapter with new cursor data
    adapter.changeCursor(cursor);
}
    private void searchOrNavigate(String searchText) {
        System.out.println("Inside Search or Navigate"+searchText);
        // Set the ticker shared preference variable to the ticker in the input box
        SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("searchTicker", searchText);
        editor.apply();
        Intent intent = new Intent(SearchBarActivity.this, SearchDetailsActivity.class);
        startActivity(intent);

        // Make API call
//        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
//                (Request.Method.GET, BASE_URL + "api/data?ticker=" + searchText, null, new Response.Listener<JSONObject>() {
//
//                    @Override
//                    public void onResponse(JSONObject response) {
//                        try {
//                            JSONObject profileData = response.getJSONObject("profileData");
//                            if (profileData.length() == 0) {
//                                // If profileData is empty, display error
//                                Toast.makeText(SearchBarActivity.this, "Invalid ticker or no data available", Toast.LENGTH_SHORT).show();
//                            } else {
//                                // If profileData is not empty, redirect to next screen
//                                Intent intent = new Intent(SearchBarActivity.this, SearchDetailsActivity.class);
//                                startActivity(intent);
//                            }
//                        } catch (JSONException e) {
//                            e.printStackTrace();
//                            Toast.makeText(SearchBarActivity.this, "Error parsing JSON response", Toast.LENGTH_SHORT).show();
//                        }
//                    }
//                }, new Response.ErrorListener() {
//
//                    @Override
//                    public void onErrorResponse(VolleyError error) {
//                        // Handle error
//                        Log.e("SearchBarActivity", "Error: " + error.getMessage());
//                        Toast.makeText(SearchBarActivity.this, "Error fetching data", Toast.LENGTH_SHORT).show();
//                    }
//                });
//
//        // Add the request to the RequestQueue.
//        Volley.newRequestQueue(this).add(jsonObjectRequest);
    }

    private void showKeyboard() {
        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
            imm.showSoftInput(searchAutoCompleteTextView, InputMethodManager.SHOW_IMPLICIT);
        }
    }

    private void hideKeyboard() {
        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
            imm.hideSoftInputFromWindow(searchAutoCompleteTextView.getWindowToken(), 0);
        }
    }


    private void updateWatchlistandPortfolio() {
        // Update each item in the watchlist
        for (StockItem item : watchlist) {
            // Update the price, changePrice, and changePercentage for each item in the watchlist
            item.stockPrice = currentPrice;
            item.stockChange = priceChange;
            item.stockdp = priceChangePercentage;
        }

        // Update each item in the portfolio
        for (PortfolioItem item : portfolio) {
                // Calculate Market Value
                double marketValue = currentPrice * item.quantity;

                // Calculate Change in Price from Total Cost
                double changeFromTotalCost = (currentPrice - item.averageCostPerShare) * item.quantity;

                // Calculate Change In Price From Total Cost Percentage
                double totalCost = item.averageCostPerShare * item.quantity;
                double changeFromTotalCostPercentage = (changeFromTotalCost / totalCost) * 100;

                // Update the UI components (TextViews) for the current PortfolioItem
            item.marketValue = marketValue;
            item.changeFromTotalCost = changeFromTotalCost;
            item.changeFromTotalCostPercentage = changeFromTotalCostPercentage;

            }
        stockItemAdapter.notifyDataSetChanged();
        portfolioItemAdapter.notifyDataSetChanged();
        }


    private double calculateMoney() {
        double money = 0;
        for (PortfolioItem item : portfolio) {
            money += item.total;
        }
        return money;
    }

    private double calculateBalance() {
        double balancenew = 0;
        balancenew = balance + calculateMoney();
        return balancenew;
    }
    private void fetchDataFromApi1() {
        // Show progress bar
        progressBar.setVisibility(View.VISIBLE);
        String url = BASE_URL + "api/user/watchlist";
        System.out.println("Inside Api1");

        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    System.out.println("Inside Response");
                    // Process the watchlist data (assuming it's an array of JSON objects)
                    try {
                        System.out.println("Inside Try");
                        JSONArray watchlistArray = response.getJSONArray("watchlist");

                        for (int i = 0; i < watchlistArray.length(); i++) {
                            JSONObject stockJson = watchlistArray.getJSONObject(i);
                            StockItem stockItem = new StockItem();
                            stockItem.symbol = stockJson.getString("symbol");
                            stockItem.companyName = stockJson.getString("companyName");
                            stockItem.stockPrice = stockJson.getDouble("stockPrice");
                            stockItem.stockChange = stockJson.getDouble("stockChange");
                            stockItem.stockdp = stockJson.getDouble("stockdp");
                            System.out.println("Stock Item Details:");
                            System.out.println("Symbol: " + stockItem.symbol);
                            System.out.println("Company Name: " + stockItem.companyName);
                            System.out.println("Stock Price: " + stockItem.stockPrice);
                            System.out.println("Stock Change: " + stockItem.stockChange);
                            System.out.println("Stockdp: " + stockItem.stockdp);
                            // Add the stockItem to the watchlist
                            watchlist.add(stockItem);
                        }
                        isWatchlistDataLoaded = true;
//                        startFetchingData();

                        runOnUiThread(() -> {
                            RecyclerView recyclerView = findViewById(R.id.watchlistRecyclerView);
                            recyclerView.setLayoutManager(new LinearLayoutManager(this));
                            // Create an instance of your StockItemAdapter

                            recyclerView.setAdapter(stockItemAdapter);
                            SwipeToDeleteHelper swipeToDeleteHelper1 = new SwipeToDeleteHelper(0, ItemTouchHelper.LEFT, this , true);
                            ItemTouchHelper itemTouchHelper1 = new ItemTouchHelper(swipeToDeleteHelper1);
                            itemTouchHelper1.attachToRecyclerView(recyclerView);

                            ItemTouchHelper.Callback callback = new ItemReOrder(stockItemAdapter);
                            ItemTouchHelper itemTouchHelper = new ItemTouchHelper(callback);
                            itemTouchHelper.attachToRecyclerView(recyclerView);


                        });
//
                        fetchDataFromApi2();

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    progressBar.setVisibility(View.GONE);
                    portfolioSection.setVisibility(View.VISIBLE);
                    favoriteSection.setVisibility(View.VISIBLE);
                    footer.setVisibility(View.VISIBLE);
                    textViewDate.setVisibility(View.VISIBLE);
                },
                error -> {
                    // Handle error (network failure or server error)
                    System.out.println(error);
                    progressBar.setVisibility(View.GONE);
                    textViewDate.setVisibility(View.VISIBLE);
                    portfolioSection.setVisibility(View.VISIBLE);
                    favoriteSection.setVisibility(View.VISIBLE);
                    footer.setVisibility(View.VISIBLE);
                });

        VolleySingleton.getInstance(this).addToRequestQueue(request);


        // Fetch data from API 1
        // Handle the response and update UI

        // Hide progress bar when done
//        progressBar.setVisibility(View.GONE);
    }

    @Override
    public void onSwipeToDelete(int position, boolean isWatchlist) {
        // Retrieve the item to be deleted
        if (isWatchlist) {
            // Retrieve the item to be deleted from the watchlist
            StockItem itemToDelete = watchlist.get(position);
            deleteWatchlistItemFromMongoDB(itemToDelete.symbol);

            // Remove the item from the watchlist
            watchlist.remove(position);

            // Notify the adapter of the item removal
            stockItemAdapter.notifyItemRemoved(position);
        } else {
            // Retrieve the item to be deleted from the portfolio
            PortfolioItem itemToDelete = portfolio.get(position);
            deletePortfolioItemFromMongoDB(itemToDelete.symbol);

            // Remove the item from the watchlist
            portfolio.remove(position);

            // Notify the adapter of the item removal
            portfolioItemAdapter.notifyItemRemoved(position);
        }
    }

    private void deletePortfolioItemFromMongoDB(String symbol) {
        // Construct the URL for your API endpoint
        String url = BASE_URL + "api/user/portfolio/remove?ticker=" + symbol;

        // Create a new JsonObjectRequest with POST method
        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.POST, url, null,
                response -> {
                    // Handle successful deletion response
                    // Refresh the portfolio data by calling fetchDataFromApi2 again
//                    fetchDataFromApi2();
                },
                error -> {
                    // Handle error response
                    Log.e("DELETE_ERROR", "Error deleting item from MongoDB: " + error.toString());
                });

        // Add the request to the Volley request queue
        Volley.newRequestQueue(this).add(request);
    }


    private void deleteWatchlistItemFromMongoDB(String symbol) {
        // Construct the URL for your API endpoint
        String url = BASE_URL + "api/user/removestockwatch";

        // Create a JSON object to hold the request parameters
        JSONObject requestData = new JSONObject();
        try {
            // Add the symbol attribute to the request data
            requestData.put("symbol", symbol);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Create a new JsonObjectRequest with POST method
        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.POST, url, requestData,
                response ->  {
                    // Handle successful deletion response
                    // Refresh the favorites page by calling fetchDataFromApi1 again
//                    fetchDataFromApi1();
                },
                error -> {
                    // Handle error response
                    Log.e("DELETE_ERROR", "Error deleting item from MongoDB: " + error.toString());
                });

        // Add the request to the Volley request queue
        Volley.newRequestQueue(this).add(request);
    }

    private void fetchDataFromApi2() {
        // Show progress bar
//        progressBar.setVisibility(View.VISIBLE);
        String url = BASE_URL + "api/user/portfolio";
        System.out.println("Inside Api2");

        JsonRequest<JSONObject> request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    System.out.println("Inside Response");
                    // Process the portfolio data
                    try {
                        System.out.println("Inside Try");
                        JSONArray portfolioArray = response.getJSONArray("portfolio");

                        for (int i = 0; i < portfolioArray.length(); i++) {
                            JSONObject stockJson = portfolioArray.getJSONObject(i);
                            PortfolioItem portfolioItem = new PortfolioItem(
                                    stockJson.getString("symbol"),
                                    stockJson.getString("company"),
                                    stockJson.getInt("quantity"),
                                    stockJson.getDouble("total"),
                                    stockJson.getDouble("averageCostPerShare"),
                                    0,0,0
                            );
//                            System.out.println("Portfolio Item Details:");
//                            System.out.println("Symbol: " + portfolioItem.getSymbol());
//                            System.out.println("Company: " + portfolioItem.getCompany());
//                            System.out.println("Quantity: " + portfolioItem.getQuantity());
//                            System.out.println("Total: " + portfolioItem.getTotal());
//                            System.out.println("Average Cost Per Share: " + portfolioItem.getAverageCostPerShare());
                            // Add the portfolioItem to the portfolio list
                            portfolio.add(portfolioItem);
                            fetchQuoteDataFromAPI(portfolioItem.symbol);
                            PortfolioItemUpdate(i);
                        }
                        isPortfolioDataLoaded = true;
                        money=calculateMoney();
                        balance= response.getDouble("money");
                        double balancetotal=calculateBalance();

                        moneyTextView.setText("$"+balancetotal);
                        balanceTextView.setText("$"+balance);


                        runOnUiThread(() -> {
                            RecyclerView recyclerViewP = findViewById(R.id.portfolioRecyclerView);
                            recyclerViewP.setLayoutManager(new LinearLayoutManager(this));

                            // Create an instance of your PortfolioItemAdapter
//                            PortfolioItemAdapter portfolioItemAdapter = new PortfolioItemAdapter(this, portfolio);
                            recyclerViewP.setAdapter(portfolioItemAdapter);

                            // Attach swipe to delete helper
                            SwipeToDeleteHelper swipeToDeleteHelper = new SwipeToDeleteHelper(0, ItemTouchHelper.LEFT, this, false);
                            ItemTouchHelper itemTouchHelperPD = new ItemTouchHelper(swipeToDeleteHelper);
                            itemTouchHelperPD.attachToRecyclerView(recyclerViewP);

                            // Attach item reorder helper
                            ItemTouchHelper.Callback callback = new ItemReOrder(portfolioItemAdapter);
                            ItemTouchHelper itemTouchHelperPR = new ItemTouchHelper(callback);
                            itemTouchHelperPR.attachToRecyclerView(recyclerViewP);
                        });

                        startFetchingData();

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


    private void startFetchingData() {
        // Check if both portfolio and watchlist data is loaded and market is open
        if (isPortfolioDataLoaded && isWatchlistDataLoaded && isMarketOpen) {
            // Start fetching data periodically
            for (StockItem item : watchlist) {
                fetchQuoteDataFromAPI(item.symbol);
            }
            // Start fetching data for each item in portfolio
            for (PortfolioItem item : portfolio) {
                fetchQuoteDataFromAPI(item.symbol);
            }
            mHandler.postDelayed(mRunnable, API_CALL_INTERVAL);
        }
    }

    private Runnable mRunnable = new Runnable() {
        @Override
        public void run() {
            // Fetch data periodically
            startFetchingData();
        }
    };


    public void openFinnhubHomePage(View view) {
        String finnhubUrl = "https://www.finnhub.io";
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(finnhubUrl));
        startActivity(intent);
    }

    private String getCurrentDate() {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault());
        return dateFormat.format(calendar.getTime());
    }
}
// Model class for stock items
class StockItem {
    String symbol;
    String companyName;
    double stockPrice;
    double stockChange;
    double stockdp;
}

