import type { Route } from "./+types/concert.$id";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router";
import type { IConcert } from "~/interfaces/IConcert";
import type { IResponse } from "~/interfaces/Response";

export function meta({ data }: Route.MetaArgs) {
  return [
    {
      title: data?.concert
        ? `${data.concert.name} - Concert Details`
        : "Concert Details",
    },
    { name: "description", content: "View concert details" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const apiEndpoint = process.env.API_ENDPOINT || "http://localhost:3000";
  try {
    const response = await axios.get<IResponse<IConcert>>(
      `${apiEndpoint}/concert/${params.id}`,
    );
    console.log(response.data);
    return { concert: response.data.data, error: null };
  } catch (error) {
    console.error("Error fetching concert:", error);
    return { concert: null, error: "Failed to fetch concert details" };
  }
}

export default function ConcertDetail() {
  const { concert, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (error || !concert) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            ← Back to Concerts
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || "Concert not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 cursor-pointer"
        >
          ← Back to Concerts
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={`${process.env.API_ENDPOINT || "http://localhost:3000"}/images/${concert.image}`}
            alt={concert.name}
            className="w-full h-96 object-cover"
          />

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {concert.name}
            </h1>

            {concert.details && (
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {concert.details}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                  Artist
                </h3>
                <p className="text-xl text-gray-900">{concert.artist}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                  Organizer
                </h3>
                <p className="text-xl text-gray-900">{concert.organizer}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                  Venue
                </h3>
                <p className="text-xl text-gray-900">{concert.venue}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
                  Date
                </h3>
                <p className="text-xl text-gray-900">
                  {new Date(concert.date).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>

            {concert.price && (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${concert.price.toFixed(2)}
                  </span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                    Buy Tickets
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
