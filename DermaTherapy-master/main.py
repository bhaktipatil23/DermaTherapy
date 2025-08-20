from inference_sdk import InferenceHTTPClient

client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="lGuDxZ2LeV6f8SZcwHS9"
)

result = client.run_workflow(
    workspace_name="eczema-veixh",
    workflow_id="custom-workflow-28",
    images={
        "image": "./frontend/src/assets/disease/Acnejpg.jpg"
    },
    use_cache=True # cache workflow definition for 15 minutes
)

print(result[0]["predictions"]['top'])