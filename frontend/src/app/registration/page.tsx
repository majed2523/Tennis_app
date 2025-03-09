import DownloadRegistrationForm from '../../components/registration-form-pdf';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-[#1A1E2E] text-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-green-400">Tennis School</span> Registration
        </h1>
        <p className="text-gray-400 mb-8">
          Download the registration form to join our tennis school. Please fill
          out all required information and bring the signed form to the club.
        </p>

        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Registration Process</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-300 mb-6">
            <li>Download and print the registration form</li>
            <li>Fill out all required information</li>
            <li>Attach a recent photo</li>
            <li>Sign the parental authorization section</li>
            <li>Bring the completed form to the club</li>
          </ol>

          <div className="flex justify-center">
            <DownloadRegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
