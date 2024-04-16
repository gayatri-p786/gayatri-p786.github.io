package com.example.stocksearchhw4;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.List;

public class AllSuggestionsAdapter extends ArrayAdapter<String> {

    private List<String> allSuggestions;

    public AllSuggestionsAdapter(Context context, int resource, List<String> suggestions) {
        super(context, resource, suggestions);
        this.allSuggestions = suggestions;
    }

    @Override
    public int getCount() {
        return allSuggestions.size();
    }

    @Override
    public String getItem(int position) {
        return allSuggestions.get(position);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        TextView view = (TextView) super.getView(position, convertView, parent);
        view.setText(allSuggestions.get(position));
        return view;
    }
}
