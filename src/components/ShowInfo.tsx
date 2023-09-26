import { ShowData, ShowDataError } from "../api/interfaces";

export interface ShowInfoProps {
  showData: ShowData | ShowDataError | null;
}

export default function ShowInfo({ showData }: ShowInfoProps) {
  if (
    showData !== null &&
    !("Error" in showData && showData.Error === "Series not found!")
  ) {
    const data = showData as ShowData;

    return (
      <div className="info">
        <span className="info__data">
          {`${data.Title} `}
          <span className="info__year">{`(${data.Year})`}</span>
          &nbsp;&nbsp;&nbsp;
          {`·`}
          &nbsp;&nbsp;&nbsp;
          {`${data.imdbRating} `}
          <span className="info__star">★</span>
          &nbsp;&nbsp;&nbsp;
          {`·`}
          &nbsp;&nbsp;&nbsp;
          {`Seasons: ${data.totalSeasons}`}
        </span>
      </div>
    );
  }
}
