<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Exception;
use App\Models\FollowUp;
use App\Http\Resources\FollowUpResource;
use App\Events\FollowUpStatusChanged;
use Carbon\Carbon;

class FollowUpApiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $followups = FollowUp::all();

        return response()->json([
            'remark' => 'all follow up details',
            'status' => 'success',
            'data' => [
                'followups' => FollowUpResource::collection($followups),
            ],
        ], 200);
    }
    
    /**
     * Schedule a followup
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'lead_id' => ['required', 'exists:leads,id'],
                'scheduled_at' => ['required', 'date', function ($attribute, $value, $fail) {
                    $now = Carbon::now()->setTimezone('Africa/Kampala');
                    $scheduledTime = Carbon::parse($value)->setTimezone('Africa/Kampala');

                    if ($scheduledTime->lessThanOrEqualTo($now)) {
                        $fail("The $attribute must be a future date.");
                    }
                }]
            ], [
                'required' => 'The :attribute is required. Please provide sufficient information.',
                'scheduled_at.date' => 'The scheduled date and time must be a valid date.',
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
            $credentials['status'] = 'pending';

            $followUp = FollowUp::create($credentials);

            return response()->json([
                'remark' => 'follow up recorded',
                'status' => 'success',
                'data' => [
                    'followUp' => new FollowUpResource($followUp),
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
     * Update followup status
     *
     * @return JsonResponse
     */
    public function updateStatus(Request $request, FollowUp $followup): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => ['required', 'string', 'in:pending,completed,missed'],
            ], [
                'required' => 'The :attribute is required. Please provide sufficient information.',
                'status.in' => 'The :attribute must be one of the following: Completed, Missed.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'remark'    => 'validation_error',
                    'status'    => 'error',
                    'message'   => $validator->errors()->all(),
                ]);
            }

            $credentials = $request->all();

            $followup->update([
                'status' => $credentials['status']
            ]);

            //Dispatch Status changed event
            FollowUpStatusChanged::dispatch($followup);

            return response()->json([
                'remark' => 'follow up status updated',
                'status' => 'success',
                'data' => [
                    'followUp' => new FollowUpResource($followup),
                ],
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'remark' => 'error',
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }
}
