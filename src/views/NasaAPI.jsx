import { useState } from "react";
import axios from "axios";

export default function NasaAPI() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState({
    manifest: [],
    metadataUrl: null,
    captionsUrl: null,
    metadata: null,
  });

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setSelected(null);
    setDetails({
      manifest: [],
      metadataUrl: null,
      captionsUrl: null,
      metadata: null,
    });
    try {
      const res = await axios.get("https://images-api.nasa.gov/search", {
        params: { q: query },
      });
      const items = res?.data?.collection?.items || [];
      const normalized = items.map((item) => {
        const d = item.data?.[0] || {};
        const linkThumb = item.links?.find(
          (l) =>
            /thumbnail/i.test(l.rel || "") || /image\//i.test(l.render || "")
        )?.href;
        return {
          nasa_id: d.nasa_id,
          title: d.title,
          description: d.description,
          media_type: d.media_type,
          date_created: d.date_created,
          center: d.center,
          thumbnail: linkThumb,
        };
      });
      setResults(normalized);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (nasaId) => {
    setSelected(nasaId);
    setDetails({
      manifest: [],
      metadataUrl: null,
      captionsUrl: null,
      metadata: null,
    });
    setError(null);
    try {
      // Manifest: list of asset files (images, videos, etc.)
      const manifestRes = await axios.get(
        `https://images-api.nasa.gov/asset/${nasaId}`
      );
      const manifestItems = manifestRes?.data?.collection?.items || [];
      const manifestUrls = manifestItems.map((i) => i.href).filter(Boolean);

      // Metadata location: fetch pointer then resolve JSON if available
      let metadataUrl = null;
      let metadata = null;
      try {
        const metaLocRes = await axios.get(
          `https://images-api.nasa.gov/metadata/${nasaId}`
        );
        metadataUrl = metaLocRes?.data?.location || null;
        if (metadataUrl && /\.json$/i.test(metadataUrl)) {
          const metaRes = await axios.get(metadataUrl);
          metadata = metaRes.data || null;
        }
      } catch {
        // ignore metadata failures
      }

      // Captions location (for videos)
      let captionsUrl = null;
      try {
        const capLocRes = await axios.get(
          `https://images-api.nasa.gov/captions/${nasaId}`
        );
        captionsUrl = capLocRes?.data?.location || null;
      } catch {
        // ignore captions failures
      }

      setDetails({
        manifest: manifestUrls,
        metadataUrl,
        captionsUrl,
        metadata,
      });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        NASA Images API Search
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search NASA media (e.g., moon, mars, apollo)"
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <div className="text-center">Loading…</div>}
      {error && (
        <div className="text-center text-red-600">
          {error.message || "Something went wrong"}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center text-gray-600">
          Try a search to see results.
        </div>
      )}
      {selected && (
        <div className="mt-8 p-6 rounded-lg bg-slate-50 border">
          <h3 className="text-xl font-semibold mb-3">
            Asset Details: {selected}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">
                Manifest Files ({details.manifest.length})
              </h4>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {details.manifest.slice(0, 25).map((url) => (
                  <li key={url} className="text-sm">
                    <a
                      className="text-teal-700 underline"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url}
                    </a>
                  </li>
                ))}
                {details.manifest.length > 25 && (
                  <li className="text-sm text-gray-600">…and more</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Metadata</h4>
              {details.metadataUrl ? (
                <div className="text-sm">
                  <p>
                    Location:{" "}
                    <a
                      className="text-teal-700 underline"
                      href={details.metadataUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {details.metadataUrl}
                    </a>
                  </p>
                  {details.metadata ? (
                    <pre className="mt-2 p-3 bg-white border rounded max-h-64 overflow-auto text-xs">
                      {JSON.stringify(details.metadata, null, 2)}
                    </pre>
                  ) : (
                    <p className="mt-2 text-gray-600">
                      Open the location link to view metadata.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No metadata available.</p>
              )}

              <h4 className="font-medium mt-4 mb-2">Captions</h4>
              {details.captionsUrl ? (
                <p className="text-sm">
                  Location:{" "}
                  <a
                    className="text-teal-700 underline"
                    href={details.captionsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {details.captionsUrl}
                  </a>
                </p>
              ) : (
                <p className="text-sm text-gray-600">No captions available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) => (
          <div key={item.nasa_id} className="p-4 rounded-lg shadow bg-white">
            <div className="flex items-start gap-4">
              {item.thumbnail && (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-violet-700">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {item.media_type?.toUpperCase()} •{" "}
                  {new Date(item.date_created).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-3">
                  {item.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1 rounded bg-teal-500 text-white"
                    onClick={() => loadDetails(item.nasa_id)}
                  >
                    Details
                  </button>
                  <a
                    className="px-3 py-1 rounded bg-gray-200"
                    href={`https://images-api.nasa.gov/asset/${item.nasa_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Manifest
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
