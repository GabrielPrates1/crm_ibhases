/*Important Imports.*/
import React from "react";

/*Imports not so important.*/
import { SearchStyles } from "./styles";
import { ReactComponent as SearchIcon } from "../../assets/icons/search.svg";
/*Creating the research component*/
const Search = (
      props: React.InputHTMLAttributes<HTMLInputElement>,
): JSX.Element => {
      return (
            <SearchStyles>
                  <div className="icon">
                        <SearchIcon width={20} />
                  </div>
                  <input type="search" {...props} />
            </SearchStyles>
      );
};

export default Search;
