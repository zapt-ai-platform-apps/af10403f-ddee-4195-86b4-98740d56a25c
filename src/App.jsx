import { createSignal, For, Show } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [currentPage, setCurrentPage] = createSignal('quiz'); // 'quiz' or 'results'
  const [loading, setLoading] = createSignal(false);
  const [responses, setResponses] = createSignal({});
  const [nameSuggestions, setNameSuggestions] = createSignal([]);
  const [error, setError] = createSignal('');

  const questions = [
    { id: 1, text: "What is your puppy's breed?" },
    { id: 2, text: "Is your puppy male or female?" },
    { id: 3, text: "What is your favorite type of music?" },
    { id: 4, text: "What is your favorite color?" },
    { id: 5, text: "What is your favorite hobby?" },
    { id: 6, text: "Do you prefer traditional or modern names?" },
    { id: 7, text: "What's your favorite book or movie?" },
    { id: 8, text: "What personality traits best describe your puppy?" },
    { id: 9, text: "Do you want a short or long name?" },
    { id: 10, text: "What is your favorite season?" },
  ];

  const handleInputChange = (id, value) => {
    setResponses(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const answers = responses();
    const prompt = `Based on the following information, suggest 10 unique and meaningful names for my new puppy:
${questions.map(q => `${q.text} ${answers[q.id] || ''}`).join('\n')}

Provide the response in JSON format as an array of names: { "names": ["Name1", "Name2", ...] }`;

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json',
      });
      if (result && result.names) {
        setNameSuggestions(result.names);
        setCurrentPage('results');
      } else {
        setError('Error parsing response. Please try again.');
      }
    } catch (err) {
      console.error('Error generating names:', err);
      setError('Error generating names. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setResponses({});
    setNameSuggestions([]);
    setCurrentPage('quiz');
    setError('');
  };

  return (
    <div class="h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-gray-800">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl font-bold text-purple-600 text-center mb-8">Name That Puppy</h1>
        <Show when={currentPage() === 'quiz'} fallback={
          <div>
            <h2 class="text-2xl font-bold text-purple-600 mb-4">Your Puppy Name Suggestions</h2>
            <Show when={!loading()} fallback={<p class="text-center">Loading...</p>}>
              <Show when={error()}>
                <p class="text-red-500 text-center mb-4">{error()}</p>
                <button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" onClick={handleRestart}>Try Again</button>
              </Show>
              <Show when={!error()}>
                <ul class="list-disc list-inside space-y-2 mb-4">
                  <For each={nameSuggestions()}>{(name) => 
                    <li class="text-lg">{name}</li>
                  }</For>
                </ul>
                <button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" onClick={handleRestart}>Start Over</button>
              </Show>
            </Show>
          </div>
        }>
          <form onSubmit={handleSubmit} class="space-y-6">
            <For each={questions}>{(question) =>
              <div>
                <label class="block text-lg font-medium mb-1">{question.text}</label>
                <input
                  type="text"
                  required
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
                  value={responses()[question.id] || ''}
                  onInput={(e) => handleInputChange(question.id, e.target.value)}
                />
              </div>
            }</For>
            <Show when={error()}>
              <p class="text-red-500">{error()}</p>
            </Show>
            <button
              type="submit"
              disabled={loading()}
              class={`w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Show when={!loading()}>Get Names</Show>
              <Show when={loading()}>Generating...</Show>
            </button>
          </form>
        </Show>
        <div class="mt-8 text-center">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
            Made on ZAPT
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;