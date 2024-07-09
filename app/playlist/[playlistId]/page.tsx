import React from "react";
import playlists from "@/playlist.json";
import PlaylistCard from "@/components/PlaylistCard";
import Image from "next/image";
import { Star, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import getPlaylistData from "@/app/actions/getPlaylistData";
import Rate from "@/components/Rate";
import getRatings from "@/app/actions/getRatings";
import PlaylistCards from "@/components/PlaylistCards";

type Props = {};

const PlaylistDetail = async ({
  params,
}: {
  params: { playlistId: string };
}) => {
  const dataPlaylist = await getPlaylistData();

  const res = await getRatings();
  if (!res) return null;

  // Find the rating for the current playlist
  const playlistRating =
    res.find((r) => r.playlist_id === params.playlistId)?.rating || null;

  console.log(dataPlaylist, "dataplaylist");

  if (!dataPlaylist) return null;
  const selectedPlaylist = dataPlaylist.find(
    (pl) => pl.id === params.playlistId
  );

  const filteredPlaylists = dataPlaylist.filter(
    (pl) => pl.id !== params.playlistId
  );

  // Sort the filtered playlists by playlist_rate in descending order
  const sortedPlaylists = filteredPlaylists.sort(
    (a, b) => b.playlist_rates! - a.playlist_rates!
  );

  // Now you can use the sortedPlaylists array to render the playlists in the desired order

  if (!selectedPlaylist) {
    return (
      <p className="flex justify-around items-center text-xl">
        Playlist not found.
      </p>
    );
  }
  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen">
      <div className="container mx-auto px-8 py-8 flex flex-col gap-14 md:gap-0 md:flex-row justify-between">
        <div className="w-full max-w-3xl felx flex-col">
          <div className="relative">
            <Image
              src={selectedPlaylist.playlist_image}
              alt={selectedPlaylist.playlist_title}
              width={300}
              height={300}
              className="w-full object-fit mb-4 rounded-xl"
            />
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <Link href={selectedPlaylist.playlist_url!} target="_blank">
                <Image src="/play.svg" alt="play" width={100} height={100} />
              </Link>
            </div>
          </div>
          <div className="flex flex-row gap-8 items-center justify-self-auto pl-6 -mt-2 max-w-2xl">
            <span className="text-md md:text-xl self-start text-[#D9D9D9]">
              {selectedPlaylist.playlist_title}
            </span>

            <span className="flex text-[#D9D9D9] justify-center items-center text-md md:text-lg gap-2">
              <Star
                fill="#FAC815"
                className="text-yellow-300"
                width={25}
                height={25}
              />
              {selectedPlaylist.playlist_rates}
            </span>
            <Rate {...selectedPlaylist} playlistRating={playlistRating!} />
            <div className="flex flex-row justify-center items-center gap-2">
              <span className="text-md md:text-lg text-gray-400 ">2.1k</span>
              <Eye className="text-gray-400" width={25} height={25} />
            </div>
          </div>
          <div className="userInfo flex flex-row gap-4 justify-start mt-8 pl-6">
            <Avatar>
              <AvatarImage
                src={selectedPlaylist.user_profile_Image_link}
                alt="profile"
              />
              <AvatarFallback className="text-white">
                <Image
                  src="/default-profile.jpg"
                  alt="profile"
                  width={200}
                  height={200}
                />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-xs md:text-sm font-medium text-gray-400">
                  Created by
                </h1>
                <h1 className="text-sm md:text-lg text-white">
                  {selectedPlaylist.user_name}
                </h1>
              </div>
              <p className="text-white text-sm bg-[#3F3F3F] p-4 w-full h-full ml-0 md:-ml-12 rounded-lg ">
                {selectedPlaylist.playlist_summary}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-6">
          <h1 className="text-md md:text-xl w-2/3 self-center text-white text-center p-2 rounded-full border border-purple-400">
            Most Rated Playlists
          </h1>

          <div className="h-screen no-scrollbar overflow-y-scroll">
            <PlaylistCards
              className="grid grid-cols-1 gap-8"
              playlistData={sortedPlaylists}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
