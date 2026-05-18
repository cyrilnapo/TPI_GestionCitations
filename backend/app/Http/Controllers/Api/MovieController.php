<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\StoreMovieRequest;
use App\Http\Requests\Movie\UpdateMovieRequest;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index(): JsonResponse
    {
        $movies = Movie::query()->latest()->get();

        return $this->jsonResponse('Movies found successfully', 200, [
            'movies' => $movies,
        ]);
    }

    public function show(Movie $movie): JsonResponse
    {
        return $this->jsonResponse('Movie found successfully', 200, [
            'movie' => $movie,
        ]);
    }

    public function store(StoreMovieRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $movie = Movie::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return $this->jsonResponse('Movie created successfully', 201, [
            'movie' => $movie,
        ]);
    }

    public function update(UpdateMovieRequest $request, Movie $movie): JsonResponse
    {
        if ((int)$movie->user_id !== (int)$request->user()->id) {
            return $this->jsonResponse('Forbidden', 403);
        }

        $movie->update($request->validated());

        return $this->jsonResponse('Movie updated successfully', 200, [
            'movie' => $movie->fresh(),
        ]);
    }

    public function destroy(Request $request, Movie $movie): JsonResponse
    {
        if ((int)$movie->user_id !== (int)$request->user()->id) { //todo : test avec et sans forcage de type, jsp encore si c'est vrmt nécessaire, à tester
            return $this->jsonResponse('Forbidden', 403);
        }

        $movie->delete();

        return $this->jsonResponse('Movie deleted successfully');
    }

    //admin
    public function adminUpdate(UpdateMovieRequest $request, Movie $movie): JsonResponse
    {
        $movie->update($request->validated());

        return $this->jsonResponse('Movie updated successfully', 200, [
            'movie' => $movie->fresh(),
        ]);
    }

    public function adminDestroy(Movie $movie): JsonResponse
    {
        $movie->delete();

        return $this->jsonResponse('Movie deleted successfully');
    }
}
