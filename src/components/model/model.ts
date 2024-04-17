import { TUserItem } from "@/pages";
import { useCallback, useReducer } from "react";

interface State {
  currentPage: number;
  currentPageList: number;
  pageNumbersList: number[];
  countriesPerList: number;
  countriesPerPage: number;
}

type Action =
  | { type: "NEXT_PAGE_LIST" }
  | { type: "PREV_PAGE_LIST" }
  | { type: "PREV_PAGE" }
  | { type: "NEXT_PAGE" }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_CURRENT_PAGE_LIST"; payload: number };

const initialState: State = {
  currentPage: 1,
  currentPageList: 1,
  pageNumbersList: [],
  countriesPerList: 10,
  countriesPerPage: 20,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "SET_CURRENT_PAGE_LIST":
      return {
        ...state,
        currentPageList: Math.ceil(action.payload / state.countriesPerList),
      };
    case "NEXT_PAGE_LIST":
      return {
        ...state,
        currentPageList: Math.max(state.currentPageList + 1, state.pageNumbersList.length),
      };
    case "PREV_PAGE_LIST":
      return {
        ...state,
        currentPageList: Math.max(state.currentPageList - 1, 1),
      };
    case "NEXT_PAGE":
      return {
        ...state,
        currentPage: Math.max(state.currentPage + 1, state.pageNumbersList.length),
      };
    case "PREV_PAGE":
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };
    default:
      return state;
  }
}

export const useModel = (users: TUserItem[]) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentPage, currentPageList } = state;

  const pageNumbersList = [];
  const pageNumbers = [];
  const pageRanges = [];

  const nextPageList = useCallback(() => {
    if (currentPageList <= pageNumbersList.length) {
      dispatch({ type: "NEXT_PAGE_LIST" });
    }
  }, [currentPageList, pageNumbersList.length]);

  const prevPageList = useCallback(() => {
    if (currentPageList > 1) {
      dispatch({ type: "PREV_PAGE_LIST" });
    }
  }, [currentPageList]);

  const lastCountryIndex = state.currentPage * state.countriesPerPage;
  const firstCountryIndex = lastCountryIndex - state.countriesPerPage;
  const currentCountry = users.slice(firstCountryIndex, lastCountryIndex);

  for (let i = 1; i <= Math.ceil(users.length / state.countriesPerPage); i++) {
    pageNumbers.push(i);
  }

  for (let i = 1; i <= Math.ceil(pageNumbers.length / state.countriesPerList); i++) {
    pageNumbersList.push(i);
  }

  for (let i = 0; i < pageNumbers.length; i += state.countriesPerList) {
    pageRanges.push(pageNumbers.slice(i, i + state.countriesPerList));
  }

  const paginate = (pageNumber: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
    dispatch({ type: "SET_CURRENT_PAGE_LIST", payload: pageNumber });
  };

  const nextPage = () => {
    if (state.currentPage !== pageNumbers.length) {
      dispatch({ type: "NEXT_PAGE" });
    }

    if (state.currentPage >= state.countriesPerList * state.currentPageList && currentPage < pageNumbers.length) {
      dispatch({ type: "NEXT_PAGE_LIST" });
    }
  };

  const prevPage = () => {
    if (state.currentPage !== 1) {
      dispatch({ type: "PREV_PAGE" });
    }

    if (
      state.currentPage <= state.countriesPerList * (state.currentPageList - 1) + 1 &&
      currentPage > state.countriesPerList
    ) {
      dispatch({ type: "PREV_PAGE_LIST" });
    }
  };

  return {
    currentCountry,
    paginate,
    currentPage,
    nextPage,
    nextPageList,
    prevPage,
    prevPageList,
    pageRanges,
    currentPageList,
  };
};
