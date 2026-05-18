<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = trim($request->query('q', ''));

        if ($query === '') {
            return $this->jsonResponse('Search query is required', 422, [
                'movies' => [],
                'quotes' => [],
            ]);
        }

        $movies = Movie::query()
            ->where('title_fr', 'like', "%{$query}%")
            ->orWhere('title_en', 'like', "%{$query}%")
            ->latest()
            ->get();

        $quotes = Quote::query()
            ->where('text', 'like', "%{$query}%")
            ->orWhere('character_name', 'like', "%{$query}%")
            ->orWhere('actor_name', 'like', "%{$query}%")
            ->latest()
            ->get();

        if ($movies->isEmpty() && $quotes->isEmpty()) {
            return $this->jsonResponse('No results found', 200, [
                'movies' => [],
                'quotes' => [],
            ]);
        }

        return $this->jsonResponse('Search completed successfully', 200, [
            'movies' => $movies,
            'quotes' => $quotes,
        ]);
    }
}
