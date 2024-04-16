package com.example.stocksearchhw4;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

public class ChartsPagerAdapter extends FragmentPagerAdapter {

    private final String historicalData;
    private final boolean lineColor;

    public ChartsPagerAdapter(@NonNull FragmentManager fm, String historicalData, boolean lineColor) {
        super(fm, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
        this.historicalData = historicalData;
        this.lineColor = lineColor;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        // Return a new instance of your chart fragment based on the position
        return ChartFragment.newInstance(position, historicalData, lineColor);
    }

    @Override
    public int getCount() {
        // Return the total number of charts
        return 2; // Assuming you have 2 charts (hourly and historical)
    }

    @Override
    public CharSequence getPageTitle(int position) {
        // Return the title for each tab
        return position == 0 ? "Hourly" : "Historical";
    }
}
