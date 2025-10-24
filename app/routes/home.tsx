import type { Route } from "./+types/home";
import axios from "axios";
import { useLoaderData, useNavigate } from "react-router";
import type { IConcert } from "~/interfaces/IConcert";
import type { IResponse } from "~/interfaces/Response";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Concerts - React Router App" },
    { name: "description", content: "Browse upcoming concerts" },
  ];
}

export async function loader() {
  const apiEndpoint = process.env.API_ENDPOINT || "http://localhost:3000";
  try {
    const response = await axios.get<IResponse<IConcert[]>>(
      `${apiEndpoint}/concert`,
    );
    return { concerts: response.data.data ?? [], error: null };
  } catch (error) {
    console.error("Error fetching concerts:", error);
    return { concerts: [], error: "Failed to fetch concerts" };
  }
}

export default function Home() {
  const { concerts, error } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Upcoming Concerts
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {concerts.length === 0 && !error ? (
          <p className="text-gray-600 text-lg">
            No concerts available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.map((concert) => (
              <div
                key={concert.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/concert/${concert.id}`)}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {concert.name}
                </h2>
                <img
                  src={`${process.env.API_ENDPOINT || "http://localhost:3000"}/images/${concert.image}`}
                  alt={concert.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Artist:</span>{" "}
                  {concert.organizer}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(concert.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Venue:</span>{" "}
                  {concert.organizer}
                </p>
                {concert.price && (
                  <p className="text-gray-800 font-semibold mt-3">
                    ${concert.price.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
