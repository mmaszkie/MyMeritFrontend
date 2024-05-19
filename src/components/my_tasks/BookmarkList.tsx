import React from "react";
import JobOfferListedDTO from "../../models/dtos/JobOfferListedDTO";
import Bookmark from "./Bookmark";
import NoItemsFound from "../NoItemsFound";

const BookmarkList: React.FC<{ bookmarks: JobOfferListedDTO[] }> = ({ bookmarks, removeFromBookmarkList }) => {
    if(bookmarks.length === 0){
        return <NoItemsFound itemName="bookmarks"/>
    }
    return (
        <ul className="flex flex-col p-0 m-0 list-none gap-4">
            {bookmarks.map((bookmark) => (
                <Bookmark key={bookmark.id} bookmarkedJob={bookmark} removeFromBookmarkList={removeFromBookmarkList}/>
            ))}
        </ul>
    );
};

export default BookmarkList;
