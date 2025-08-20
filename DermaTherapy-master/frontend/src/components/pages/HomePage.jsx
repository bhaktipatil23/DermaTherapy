import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";
import RemedyDownload from "./RemedyDownload";
export const HomePage = () => {
  const [step, setStep] = useState(0);
  const [stepperVisible, setStepperVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    skin_type: '',
    primary_symptoms: '',
    duration: '',
    severity: '',
    body_area: '',
    daily_routine: '',
    diet: '',
    allergies: '',
    existing_conditions: '',
    medications: '',
    family_history: '',
    other_symptoms: '',
    consent: ''
  });
  const [result, setResult] = useState('');

  const steps = ["Upload", "Survey", "Result"];
  
  // Modified nextStep function to include validation
  const nextStep = () => {
    // If we're on step 0 (Upload), validate that an image is selected
    if (step === 0) {
      if (!image) {
        setError("Please upload an image before proceeding");
        return;
      }
      setError(null); // Clear error if image is valid
    }
    
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'age', 'gender', 'skin_type', 'primary_symptoms', 
      'duration', 'severity', 'body_area', 'consent'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Age validation
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 1 || parseInt(formData.age) > 120)) {
      errors.age = 'Please enter a valid age between 1 and 120';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      // Scroll to the top of the form to show the error
      document.querySelector('.space-y-6')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formPayload = new FormData();

      // Append image if selected
      if (image) {
        formPayload.append('image', image);
      }

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      const response = await fetch("http://127.0.0.1:5000/submit_symptoms", {
        method: "POST",
        body: formPayload
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const html = await response.text();
      setResult(html);
      nextStep();
    } catch (err) {
      setError(err.message || "Error fetching result. Please try again.");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render form field label with required indicator
  const renderLabel = (htmlFor, text) => (
    <Label htmlFor={htmlFor} className="flex items-start gap-1">
      {text}
      <span className="text-red-500">*</span>
    </Label>
  );

  // Helper function to determine field error state
  const getFieldErrorClass = (fieldName) => {
    return validationErrors[fieldName] 
      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
  };
  
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-[#c3f4fd] px-6">
      <h1 className="text-4xl font-bold text-center text-[#03045E] mb-4">Skin Diagnosis Assistant</h1>
      <p className="mt-4 text-lg text-center text-gray-600">Analyze your skin symptoms and get remedy recommendations</p>

      {!stepperVisible && (
        <Button className="mt-8 px-8 py-3 bg-[#0077B6] text-white cursor-pointer" onClick={() => setStepperVisible(true)}>
          Begin Skin Diagnosis
        </Button>
      )}

      {stepperVisible && (
        <Card className="w-full max-w-3xl mt-8 shadow-lg bg-[#f2f5f6] rounded-lg">
          <CardContent className="p-8">
            {/* Stepper */}
            <div className="flex gap-5 justify-between mb-6">
              {steps.map((label, idx) => (
                <div key={label}
                  className={`gap-5 flex-1 text-center py-2 px-4 mx-1 rounded-full font-semibold transition-all ${
                    step === idx ? "bg-[#00B4D8] text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                  {label}
                </div>
              ))}
            </div>

            {/* Error display */}
            {error && (
              <div className="p-4 mb-4 flex items-start gap-3 rounded-md bg-red-50 border border-red-300 text-red-800">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
                <div>
                  <h4 className="font-medium">Error</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center my-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Step 0: Upload */}
            {step === 0 && (
              <div className="space-y-4">
                {renderLabel("upload", "Upload image of skin condition")}
                <Input 
                  id="upload" 
                  type="file" 
                  accept="image/*"
                  className={`w-full rounded-md p-2 ${!image ? "border-red-500" : "border-gray-300"}`}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                      setError(null); // Clear error when image is uploaded
                    }
                  }}
                  required
                />
                {!image && (
                  <p className="text-red-500 text-sm mt-1">Please upload an image</p>
                )}
                {image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 font-bold">Selected: <span className="text-[#03045E]">{image.name}</span></p>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Form */}
            {step === 1 && (
              <div className="space-y-6 max-h-96 overflow-y-auto px-1">
                <p className="text-sm text-red-500 mb-2">Fields marked with * are required</p>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    {renderLabel("age", "Age")}
                    <Input 
                      type="number" 
                      name="age" 
                      id="age" 
                      placeholder="Age" 
                      onChange={handleChange} 
                      value={formData.age} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('age')}`}
                      required
                    />
                    {validationErrors.age && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.age}</p>
                    )}
                  </div>

                  <div>
                    {renderLabel("gender", "Gender")}
                    <select 
                      name="gender" 
                      id="gender" 
                      onChange={handleChange} 
                      value={formData.gender} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('gender')}`}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_say">Prefer not to say</option>
                    </select>
                    {validationErrors.gender && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                    )}
                  </div>

                  <div>
                    {renderLabel("skin_type", "Skin Type")}
                    <select 
                      name="skin_type" 
                      id="skin_type" 
                      onChange={handleChange} 
                      value={formData.skin_type} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('skin_type')}`}
                      required
                    >
                      <option value="">Select Skin Type</option>
                      <option value="oily">Oily</option>
                      <option value="dry">Dry</option>
                      <option value="combination">Combination</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="normal">Normal</option>
                      <option value="not_sure">Not sure</option>
                    </select>
                    {validationErrors.skin_type && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.skin_type}</p>
                    )}
                  </div>

                  {/* <div>
                    {renderLabel("primary_symptoms", "Primary Symptoms")}
                    <Textarea 
                      name="primary_symptoms" 
                      id="primary_symptoms" 
                      placeholder="Describe the primary symptoms" 
                      onChange={handleChange} 
                      value={formData.primary_symptoms} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('primary_symptoms')}`}
                      required
                    />
                    {validationErrors.primary_symptoms && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.primary_symptoms}</p>
                    )}
                  </div> */}

                  <div>
                    {renderLabel("primary_symptoms", "Primary Symptoms")}
                    <input
                      list="symptom-options"
                      name="primary_symptoms"
                      id="primary_symptoms"
                      placeholder="Select or type a symptom"
                      onChange={handleChange}
                      value={formData.primary_symptoms}
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('primary_symptoms')}`}
                      required
                    />
                    <datalist id="symptom-options">
                      <option value="red patches" />
                      <option value="itching" />
                      <option value="pimples" />
                      <option value="acne" />
                      <option value="dark spots" />
                      <option value="pigmentation" />
                      <option value="eczema" />
                      <option value="fungal" />
                      <option value="ring" />
                      <option value="scaly patches" />
                    </datalist>
                    {validationErrors.primary_symptoms && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.primary_symptoms}</p>
                    )}
                  </div>



                  <div>
                    {renderLabel("duration", "Duration of Symptoms")}
                    <Input 
                      name="duration" 
                      id="duration" 
                      placeholder="How long have you had symptoms?" 
                      onChange={handleChange} 
                      value={formData.duration} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('duration')}`}
                      required
                    />
                    {validationErrors.duration && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.duration}</p>
                    )}
                  </div>

                  <div>
                    {renderLabel("severity", "Severity")}
                    <select 
                      name="severity" 
                      id="severity" 
                      onChange={handleChange} 
                      value={formData.severity} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('severity')}`}
                      required
                    >
                      <option value="">Select Severity</option>
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                    {validationErrors.severity && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.severity}</p>
                    )}
                  </div>

                  <div>
                    {renderLabel("body_area", "Affected Body Area")}
                    <Input 
                      name="body_area" 
                      id="body_area" 
                      placeholder="Where on your body is affected?" 
                      onChange={handleChange} 
                      value={formData.body_area} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('body_area')}`}
                      required
                    />
                    {validationErrors.body_area && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.body_area}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="daily_routine">Describe your daily skincare routine</Label>
                    <Textarea 
                      name="daily_routine" 
                      id="daily_routine" 
                      onChange={handleChange} 
                      value={formData.daily_routine} 
                      className="w-full border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="diet">Dietary habits</Label>
                    <Textarea 
                      name="diet" 
                      id="diet" 
                      onChange={handleChange} 
                      value={formData.diet} 
                      className="w-full border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies">Known allergies</Label>
                    <Input 
                      name="allergies" 
                      id="allergies" 
                      onChange={handleChange} 
                      value={formData.allergies} 
                      className="w-full border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="existing_conditions">Any existing medical conditions</Label>
                    <Input 
                      name="existing_conditions" 
                      id="existing_conditions" 
                      onChange={handleChange} 
                      value={formData.existing_conditions} 
                      className="w-full border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medications">Ongoing medications</Label>
                    <Input 
                      name="medications" 
                      id="medications" 
                      onChange={handleChange} 
                      value={formData.medications} 
                      className="w-full border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    {renderLabel("consent", "Consent to share image?")}
                    <select 
                      name="consent" 
                      id="consent" 
                      onChange={handleChange} 
                      value={formData.consent} 
                      className={`w-full rounded-md p-2 ${getFieldErrorClass('consent')}`}
                      required
                    >
                      <option value="">Choose</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {validationErrors.consent && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.consent}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Result */}
            {step === 2 && (
              <div className="text-left">
                <h2 className="text-xl font-semibold mb-4">Remedy Recommendation</h2>
                <div className="prose max-w-full overflow-x-hidden max-h-96 overflow-y-auto p-4 border rounded-md bg-white">
                  {result ? (
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                  ) : (
                    <p className="text-gray-500">No results available.</p>
                  )}
                </div>
                <RemedyDownload result={result} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={step === 0 || isLoading} 
                className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Back
              </Button>
              
              {step === 1 ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#0077B6] text-white hover:bg-[#03045E] disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                step < steps.length - 1 && (
                  <Button 
                    onClick={nextStep} 
                    className="px-6 py-2 bg-[#0077B6] text-white hover:bg-[#03045E]"
                  >
                    Next
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};