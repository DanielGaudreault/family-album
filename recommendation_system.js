// Sample user-item interaction data
var userItemData = {
    'User1': {'Item1': 5, 'Item2': 4, 'Item3': 0, 'Item4': 1},
    'User2': {'Item1': 2, 'Item2': 0, 'Item3': 5, 'Item4': 3},
    'User3': {'Item1': 0, 'Item2': 3, 'Item3': 4, 'Item4': 5},
    'User4': {'Item1': 1, 'Item2': 2, 'Item3': 3, 'Item4': 4}
};

// Function to generate recommendations for a given user
function generateRecommendations(userId) {
    var userInteractions = userItemData[userId];
    var allItems = Object.keys(userItemData['User1']); // Assuming all users have rated the same set of items

    // Calculate weighted sum of ratings from similar users
    var weightedSum = {};
    for (var user in userItemData) {
        if (user !== userId) {
            var similarity = cosineSimilarity(userItemData[userId], userItemData[user]);
            for (var item in userItemData[user]) {
                if (!(item in userInteractions)) {
                    if (!(item in weightedSum)) {
                        weightedSum[item] = 0;
                    }
                    weightedSum[item] += userItemData[user][item] * similarity;
                }
            }
        }
    }

    // Sort items by weighted sum in descending order
    var recommendations = Object.keys(weightedSum).sort(function(a, b) {
        return weightedSum[b] - weightedSum[a];
    });

    return recommendations.slice(0, 3); // Return top 3 recommendations
}

// Function to calculate cosine similarity between two vectors
function cosineSimilarity(vector1, vector2) {
    var dotProduct = 0;
    var magnitude1 = 0;
    var magnitude2 = 0;
    for (var key in vector1) {
        dotProduct += vector1[key] * vector2[key];
        magnitude1 += Math.pow(vector1[key], 2);
        magnitude2 += Math.pow(vector2[key], 2);
    }
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    return dotProduct / (magnitude1 * magnitude2);
}

// Display user ratings and recommendations
function displayData(userId) {
    var userRatingsTable = document.getElementById('userRatingsTable');
    var recommendationsList = document.getElementById('recommendationsList');

    // Clear previous data
    userRatingsTable.innerHTML = '';
    recommendationsList.innerHTML = '';

    // Display user ratings
    var userRatingsRow = '<tr><th>Item</th><th>Rating</th></tr>';
    for (var item in userItemData[userId]) {
        userRatingsRow += '<tr><td>' + item + '</td><td>' + userItemData[userId][item] + '</td></tr>';
    }
    userRatingsTable.innerHTML = userRatingsRow;

    // Display recommendations
    var recommendations = generateRecommendations(userId);
    var recommendationsListItems = '';
    recommendations.forEach(function(item) {
        recommendationsListItems += '<li>' + item + '</li>';
    });
    recommendationsList.innerHTML = recommendationsListItems;
}

// Example usage
displayData('User1');
