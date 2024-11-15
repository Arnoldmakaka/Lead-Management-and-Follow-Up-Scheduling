<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\Models\Lead;
use App\Http\Resources\LeadResource;

class LeadsApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leads = Lead::all();

        return response()->json([
            'remark'    => 'all lead details',
            'status'    => 'success',
            'data' => [
                'leads' => LeadResource::collection($leads),
            ],
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string'],
                'email' => ['required', 'string', 'email', 'unique:leads,email'],
                'phone' => ['required', 'string'],
            ], [
                'title.unique' => 'The :attribute exists. Enter a new :attribute',
                'required' => 'The :attribute is required. Please provide sufficient information.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'remark'    => 'validation_error',
                    'status'    => 'error',
                    'message'   => $validator->errors()->all(),
                ]);
            }

            // Retrieve credentials
            $credentials = $request->all();

            $lead = Lead::create($credentials);

            return response()->json([
                'remark' => 'lead recorded',
                'status' => 'success',
                'data' => [
                    'lead' => new LeadResource($lead),
                ],
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'remark' => 'error',
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
