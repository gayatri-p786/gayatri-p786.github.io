package com.example.stocksearchhw4;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import android.content.Intent;
import android.os.Handler;

public class MainActivity extends AppCompatActivity {

    private static final int SPLASH_SCREEN_DURATION = 3000; // 3 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash); // Set your main layout here

        // Delayed transition to SearchBarActivity
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // Start the SearchBarActivity
                Intent intent = new Intent(MainActivity.this, SearchBarActivity.class);
                startActivity(intent);
                finish(); // Finish the current activity (splash screen)
            }
        }, SPLASH_SCREEN_DURATION);
    }
}