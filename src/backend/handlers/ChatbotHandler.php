<?php
class ChatbotHandler {
    private $db;
    private $user_id;

    public function __construct($db, $user_id) {
        $this->db = $db;
        $this->user_id = $user_id;
    }

    public function fetchAvailableGoals() {
        $result = $this->db->query("SELECT goal_name FROM fitness_goals");
        $goals = [];
        while ($row = $result->fetch_assoc()) {
            $goals[] = $row['goal_name'];
        }
        $this->respond("🏅 Available goals: " . implode(", ", $goals));
    }

    public function getGoals() {
        $stmt = $this->db->prepare("
            SELECT fg.goal_name 
            FROM user_fitness_goals ufg
            JOIN fitness_goals fg ON ufg.fitness_goal_id = fg.id
            WHERE ufg.user_id = ?
        ");
        $stmt->bind_param("i", $this->user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $goals = [];
        while ($row = $result->fetch_assoc()) {
            $goals[] = $row['goal_name'];
        }
        $stmt->close();

        $this->respond(empty($goals) ? "😞 No goals set." : "🏋️ Your goals: " . implode(", ", $goals));
    }

    public function addGoalsFromArray(array $goals) {
        $stmt = $this->db->prepare("INSERT INTO user_fitness_goals (user_id, fitness_goal_id) VALUES (?, ?)");

        $addedGoals = [];

        foreach ($goals as $goalName) {
            $goalId = $this->getGoalIdByName($goalName);

            file_put_contents(__DIR__ . '/../../debug_log.txt', "Checking goal: $goalName, found ID: " . ($goalId ?? 'NOT FOUND') . "\n", FILE_APPEND);

            if ($goalId) {
                $stmt->bind_param("is", $this->user_id, $goalId);
                $stmt->execute();
                $addedGoals[] = $goalName;
            }
        }

        $stmt->close();

        if (empty($addedGoals)) {
            $this->respond("❌ None of those goals were found. Please check spelling or ask 'what goals can I set?'.");
        } else {
            $this->respond("✅ Added goals: " . implode(", ", $addedGoals));
        }
    }

    private function getGoalIdByName($name) {
        $name = strtolower($name);
        $stmt = $this->db->prepare("SELECT id FROM fitness_goals WHERE LOWER(goal_name) = LOWER(?)");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        return $result['id'] ?? null;
    }

    public function chatWithGPT($message) {
        // Load dataset from your actual folder location (src/datasets)
        $datasetPath = __DIR__ . '/../../datasets/fitness_knowledge.txt';

        if (!file_exists($datasetPath)) {
            $this->respond("❌ Dataset file missing at: $datasetPath");
            return;
        }

        $dataset = file_get_contents($datasetPath);

        $prompt = "
You are a fitness assistant that can only respond based on the dataset below.
If the answer to the user's question is not in the dataset, respond with: 'I don't know based on the provided data.'

=== DATASET START ===
$dataset
=== DATASET END ===

User's question: $message
";

        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => "Bearer " . $_ENV['OPENAI_API_KEY'],
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-4',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.1
            ]
        ]);

        $apiResponse = json_decode($response->getBody(), true);
        $this->respond($apiResponse['choices'][0]['message']['content'] ?? 'No response.');
    }

    private function respond($message) {
        echo json_encode(["message" => $message]);
    }
}
