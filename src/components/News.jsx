import React, { useEffect, useState } from "react";
import { NewsItem } from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import PropTypes from "prop-types";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?&country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);
    props.setProgress(30);

    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(parsedData);

    props.setProgress(70);

    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter( props.category)} - FreedomNewsApp`;
    updateNews();
  }, []);

  // // next page function
  // const handleNextPage = async () => {
  //   setPage(page + 1);
  //   updateNews();
  // };

  // // previous page function
  // const handlePrevPage = async () => {
  //   setPage(page - 1);
  //   updateNews();
  // };

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?&country=${
      props.country
    }&category=${props.category}&apiKey=${props.apikey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);

    let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(parsedData);

    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };

  return (
    <>
      <h1 className="text-center my-5" style={{ marginTop: "120px" }}>
        FreedomNewsApp - Top {capitalizeFirstLetter(props.category)} Head Lines
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((ele) => (
              <div key={ele.url} className="col-md-4">
                <NewsItem
                  title={ele.title ? ele.title : ""}
                  description={ele.description ? ele.description : ""}
                  imageUrl={
                    ele.urlToImage
                      ? ele.urlToImage
                      : "https://media.cnn.com/api/v1/images/stellar/prod/220406001219-01-connie-conway-file.jpg?c=16x9&q=w_800,c_fill"
                  }
                  newsUrl={ele.url}
                  author={ele.author}
                  date={ele.publishedAt}
                  source={ele.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>

      {/* Next and Previous Buttons  */}

      {/* <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevPage}
          >
            {" "}
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextPage}
          >
            Next &rarr;
          </button>
        </div> */}
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 12,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
