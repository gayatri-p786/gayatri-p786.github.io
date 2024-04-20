package com.example.stocksearchhw4;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class NewsAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private JSONArray newsData;
    private Context context;
    private NewsItemClickListener listener;

    private static final int VIEW_TYPE_TOP_NEWS = 0;
    private static final int VIEW_TYPE_REGULAR_NEWS = 1;

    // Interface to handle click events
    public interface NewsItemClickListener {
        void onNewsItemClick(JSONObject newsItem);
    }

    public NewsAdapter(Context context, JSONArray newsData, NewsItemClickListener listener) {
        this.context = context;
        this.newsData = newsData;
        this.listener = listener;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        View view;
        if (viewType == VIEW_TYPE_TOP_NEWS) {
            // Inflate layout for top news item
            view = inflater.inflate(R.layout.tops_news_item_layout, parent, false);
            return new TopNewsViewHolder(view);
        } else {
            // Inflate layout for regular news item
            view = inflater.inflate(R.layout.news_item_layout, parent, false);
            return new NewsViewHolder(view);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        try {
            JSONObject newsItem = newsData.getJSONObject(position);
            if (holder instanceof TopNewsViewHolder) {
                // Bind data for top news item
                ((TopNewsViewHolder) holder).bind(newsItem);
            } else if (holder instanceof NewsViewHolder) {
                // Bind data for regular news item
                ((NewsViewHolder) holder).bind(newsItem);
            }
            // Set onClick listener for each card
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (listener != null) {
                        listener.onNewsItemClick(newsItem);
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public int getItemCount() {
        return newsData.length();
    }

    @Override
    public int getItemViewType(int position) {
        // Check if it's the first item (top news)
        return position == 0 ? VIEW_TYPE_TOP_NEWS : VIEW_TYPE_REGULAR_NEWS;
    }

    public static class TopNewsViewHolder extends RecyclerView.ViewHolder {
        ImageView newsImageView;
        TextView sourceTextView;
        TextView elapsedTimeTextView;
        TextView titleTextView;

        public TopNewsViewHolder(@NonNull View itemView) {
            super(itemView);
            newsImageView = itemView.findViewById(R.id.top_news_image);
            sourceTextView = itemView.findViewById(R.id.top_news_source);
            elapsedTimeTextView = itemView.findViewById(R.id.top_news_elapsed_time);
            titleTextView = itemView.findViewById(R.id.top_news_title);
        }

        public void bind(JSONObject newsItem) {
            try {
                // Check if the n
                    // Bind data for top news item
                    Picasso.get().load(newsItem.getString("image")).fit().centerCrop().into(newsImageView);
                    sourceTextView.setText(newsItem.getString("source"));
                    elapsedTimeTextView.setText(calculateElapsedTime(newsItem.getLong("datetime")));
                    titleTextView.setText(newsItem.getString("headline"));

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

    }

    public static class NewsViewHolder extends RecyclerView.ViewHolder {
        ImageView newsImageView;
        TextView sourceTextView;
        TextView elapsedTimeTextView;
        TextView titleTextView;

        public NewsViewHolder(@NonNull View itemView) {
            super(itemView);
            newsImageView = itemView.findViewById(R.id.news_image);
            sourceTextView = itemView.findViewById(R.id.news_source);
            elapsedTimeTextView = itemView.findViewById(R.id.news_elapsed_time);
            titleTextView = itemView.findViewById(R.id.news_title);
        }

        public void bind(JSONObject newsItem) {
            try {
                // Bind data for regular news item
                Picasso.get().load(newsItem.getString("image")).fit().centerCrop().into(newsImageView);
                sourceTextView.setText(newsItem.getString("source"));
                elapsedTimeTextView.setText(calculateElapsedTime(newsItem.getLong("datetime")));
                titleTextView.setText(newsItem.getString("headline"));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    // Helper method to calculate elapsed time since publishing
    private static String calculateElapsedTime(long datetime) {
        long currentTimeMillis = System.currentTimeMillis();
        long elapsedTimeMillis = currentTimeMillis - datetime * 1000;
        long hours = elapsedTimeMillis / (1000 * 60 * 60);
        return hours + " hours ago";
    }

}
