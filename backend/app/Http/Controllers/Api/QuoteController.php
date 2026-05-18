<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quote\StoreQuoteRequest;
use App\Http\Requests\Quote\UpdateQuoteRequest;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index(): JsonResponse
    {
        $quotes = Quote::query()->latest()->get();

        return $this->jsonResponse('Quotes found successfully', 200, [
            'quotes' => $quotes,
        ]);
    }

    public function show(Quote $quote): JsonResponse
    {
        return $this->jsonResponse('Quote found successfully', 200, [
            'quote' => $quote,
        ]);
    }

    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $quote = Quote::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return $this->jsonResponse('Quote created successfully', 201, [
            'quote' => $quote,
        ]);
    }

    public function update(UpdateQuoteRequest $request, Quote $quote): JsonResponse
    {
        if ((int)$quote->user_id !== (int)$request->user()->id) {
            return $this->jsonResponse('Forbidden', 403);
        }

        $quote->update($request->validated());

        return $this->jsonResponse('Quote updated successfully', 200, [
            'quote' => $quote->fresh(),
        ]);
    }

    public function destroy(Request $request, Quote $quote): JsonResponse
    {
        if ((int)$quote->user_id !== (int)$request->user()->id) {
            return $this->jsonResponse('Forbidden', 403);
        }

        $quote->delete();

        return $this->jsonResponse('Quote deleted successfully');
    }


    //admin
    public function adminUpdate(UpdateQuoteRequest $request, Quote $quote): JsonResponse
    {
        $quote->update($request->validated());

        return $this->jsonResponse('Quote updated successfully', 200, [
            'quote' => $quote->fresh(),
        ]);
    }

    public function adminDestroy(Quote $quote): JsonResponse
    {
        $quote->delete();

        return $this->jsonResponse('Quote deleted successfully');
    }
}
