// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTJXyaIIcbj3aZwQHdZNiQdaj-F-xwca0",
    authDomain: "nirvaah-2025.firebaseapp.com",
    databaseURL: "https://nirvaah-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nirvaah-2025",
    storageBucket: "nirvaah-2025.appspot.com",
    messagingSenderId: "47528149561",
    appId: "1:47528149561:web:e0594c57190668a554c3e8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Sample data for teams (used only for initialization)
const sampleTeamsData = {
    management: [
        { id: 1, name: "Team-1", score: 0 },
        { id: 2, name: "Team-2", score: 0 },
        { id: 3, name: "Team-3", score: 0 },
        { id: 4, name: "Team-4", score: 0 },
        { id: 5, name: "Team-5", score: 0 },
        { id: 6, name: "Team-6", score: 0 },
        { id: 7, name: "Team-7", score: 0 },
        { id: 8, name: "Team-8", score: 0 },
        { id: 9, name: "Team-9", score: 0 },
        { id: 10, name: "Team-10", score: 0 },
        { id: 11, name: "Team-11", score: 0 },
        { id: 12, name: "Team-12", score: 0 },
        { id: 13, name: "Team-13", score: 0 },
        { id: 14, name: "Team-14", score: 0 },
        { id: 15, name: "Team-15", score: 0 },
        { id: 16, name: "Team-16", score: 0 },
        { id: 17, name: "Team-17", score: 0 },
        { id: 18, name: "Team-18", score: 0 },
        { id: 19, name: "Team-19", score: 0 },
        { id: 20, name: "Team-20", score: 0 }
    ],
    marketing: [
        { id: 1, name: "Team-1", score: 0 },
        { id: 2, name: "Team-2", score: 0 },
        { id: 3, name: "Team-3", score: 0 },
        { id: 4, name: "Team-4", score: 0 },
        { id: 5, name: "Team-5", score: 0 },
        { id: 6, name: "Team-6", score: 0 },
        { id: 7, name: "Team-7", score: 0 },
        { id: 8, name: "Team-8", score: 0 },
        { id: 9, name: "Team-9", score: 0 },
        { id: 10, name: "Team-10", score: 0 },
        { id: 11, name: "Team-11", score: 0 },
        { id: 12, name: "Team-12", score: 0 },
        { id: 13, name: "Team-13", score: 0 },
        { id: 14, name: "Team-14", score: 0 },
        { id: 15, name: "Team-15", score: 0 },
        { id: 16, name: "Team-16", score: 0 },
        { id: 17, name: "Team-17", score: 0 },
        { id: 18, name: "Team-18", score: 0 },
        { id: 19, name: "Team-19", score: 0 },
        { id: 20, name: "Team-20", score: 0 }
    ],
    "sustainable-finance": [
        { id: 1, name: "Team-1", score: 0 },
        { id: 2, name: "Team-2", score: 0 },
        { id: 3, name: "Team-3", score: 0 },
        { id: 4, name: "Team-4", score: 0 },
        { id: 5, name: "Team-5", score: 0 },
        { id: 6, name: "Team-6", score: 0 },
        { id: 7, name: "Team-7", score: 0 },
        { id: 8, name: "Team-8", score: 0 },
        { id: 9, name: "Team-9", score: 0 },
        { id: 10, name: "Team-10", score: 0 },
        { id: 11, name: "Team-11", score: 0 },
        { id: 12, name: "Team-12", score: 0 },
        { id: 13, name: "Team-13", score: 0 },
        { id: 14, name: "Team-14", score: 0 },
        { id: 15, name: "Team-15", score: 0 },
        { id: 16, name: "Team-16", score: 0 },
        { id: 17, name: "Team-17", score: 0 },
        { id: 18, name: "Team-18", score: 0 },
        { id: 19, name: "Team-19", score: 0 },
        { id: 20, name: "Team-20", score: 0 }
    ]
};

// Track previous ranks for each vertical
const previousRanks = {
    management: {},
    marketing: {},
    "sustainable-pr": {}
};

// Function to initialize database with sample data
function initializeDatabase() {
    for (const vertical in sampleTeamsData) {
        const verticalRef = database.ref(`scores/${vertical}`);
        
        // Set the data for this vertical
        verticalRef.set(sampleTeamsData[vertical])
            .then(() => {
                console.log(`Database initialized with ${vertical} data`);
            })
            .catch((error) => {
                console.error(`Error initializing ${vertical} data:`, error);
            });
    }
}

// Function to render leaderboard based on selected vertical
function renderLeaderboard(vertical, teams) {
    const leaderboardBody = document.getElementById('leaderboard-body');
    
    // Show loading state
    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4" class="loading">
                <i class="fas fa-spinner"></i> Loading leaderboard data...
            </td>
        </tr>
    `;
    
    if (!teams || teams.length === 0) {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px;">
                    No data available for this vertical.
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort teams by score in descending order
    teams.sort((a, b) => b.score - a.score);
    
    // Update previous ranks and determine trend
    teams.forEach((team, index) => {
        const rank = index + 1;
        
        // Determine trend
        if (previousRanks[vertical][team.id] !== undefined) {
            if (rank < previousRanks[vertical][team.id]) {
                team.trend = "up";
            } else if (rank > previousRanks[vertical][team.id]) {
                team.trend = "down";
            } else {
                team.trend = "stable";
            }
        } else {
            team.trend = "stable";
        }
        
        // Update previous rank
        previousRanks[vertical][team.id] = rank;
    });
    
    // Clear loading state
    leaderboardBody.innerHTML = '';
    
    // Populate the leaderboard
    teams.forEach((team, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Add highlight for top 3 teams
        if (rank <= 3) {
            row.classList.add('highlight');
        }
        
        // Determine rank change indicator
        let rankChange = '';
        if (team.trend !== "stable") {
            const change = previousRanks[vertical][team.id] - rank;
            if (change > 0) {
                rankChange = `<span class="rank-change up"><i class="fas fa-caret-up"></i>${change}</span>`;
            } else if (change < 0) {
                rankChange = `<span class="rank-change down"><i class="fas fa-caret-down"></i>${Math.abs(change)}</span>`;
            }
        }
        
        // Add medal for top 3
        let medal = '';
        if (rank === 1) {
            medal = '<span class="medal gold"><i class="fas fa-crown"></i></span>';
        } else if (rank === 2) {
            medal = '<span class="medal silver"><i class="fas fa-award"></i></span>';
        } else if (rank === 3) {
            medal = '<span class="medal bronze"><i class="fas fa-award"></i></span>';
        }
        
        // Determine trend icon
        let trendIcon = '';
        if (team.trend === "up") {
            trendIcon = '<i class="fas fa-arrow-up trend-up"></i>';
        } else if (team.trend === "down") {
            trendIcon = '<i class="fas fa-arrow-down trend-down"></i>';
        } else {
            trendIcon = '<i class="fas fa-minus trend-stable"></i>';
        }
        
        row.innerHTML = `
            <td>
                <div class="rank">
                    ${medal}
                    ${rank}
                    ${rankChange}
                </div>
            </td>
            <td>
                <div class="team-name">
                    <div class="logo">${team.name.charAt(0)}</div>
                    ${team.name}
                </div>
            </td>
            <td class="score">${team.score}</td>
            <td class="trend">${trendIcon}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Initialize with the first vertical
let currentVertical = 'management';

// Listen for changes in Firebase
function setupFirebaseListeners() {
    const verticals = ['management', 'marketing', 'sustainable-pr'];
    
    verticals.forEach(vertical => {
        const verticalRef = database.ref(`scores/${vertical}`);
        
        verticalRef.on('value', (snapshot) => {
            const data = snapshot.val();
            
            if (data && currentVertical === vertical) {
                renderLeaderboard(vertical, data);
            }
        });
    });
}

// Check if database has data, initialize if empty
function checkAndInitializeDatabase() {
    const verticalRef = database.ref('scores');
    
    verticalRef.once('value').then(snapshot => {
        if (!snapshot.exists()) {
            // Database is empty, initialize with sample data
            initializeDatabase();
            console.log("Database initialized with sample data");
        } else {
            console.log("Database already has data, using existing data");
        }
        
        // Set up listeners and load initial data
        setupFirebaseListeners();
        
        // Load initial data for the current vertical
        const currentVerticalRef = database.ref(`scores/${currentVertical}`);
        currentVerticalRef.once('value').then(snapshot => {
            const data = snapshot.val();
            if (data) {
                renderLeaderboard(currentVertical, data);
            }
        });
    }).catch(error => {
        console.error("Error checking database:", error);
    });
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Tab click handlers
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update the current vertical
            currentVertical = tab.getAttribute('data-vertical');
            
            // Fetch data for the selected vertical
            const verticalRef = database.ref(`scores/${currentVertical}`);
            verticalRef.once('value').then(snapshot => {
                const data = snapshot.val();
                if (data) {
                    renderLeaderboard(currentVertical, data);
                }
            });
        });
    });

    // Initialize the app
    checkAndInitializeDatabase();
});