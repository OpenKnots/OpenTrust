"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export function GitHubStars({
  username,
  repo,
}: {
  username: string;
  repo: string;
}) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${username}/${repo}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.stargazers_count === "number") setStars(d.stargazers_count);
      })
      .catch(() => {});
  }, [username, repo]);

  if (stars === null) return null;

  return (
    <a
      href={`https://github.com/${username}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="github-stars"
    >
      <Star size={14} />
      <span className="github-stars__count">
        {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars}
      </span>
    </a>
  );
}
