// Services
import { httpService } from "../../services/http";
import { apiUrl } from "../../services/config";
import { start_slideshow } from "./slideshow.navigate";

export const actionTypes = {
  FETCHING_SLIDESHOW_INIT: "FETCHING_SLIDESHOW_INIT",
  FETCHING_SLIDESHOW_SUCCESS: "FETCHING_SLIDESHOW_SUCCESS",
  FETCHING_SLIDESHOW_ERROR: "FETCHING_SLIDESHOW_ERROR"
};

export const fetching_slideshow_init = () => {
  return {
    type: actionTypes.FETCHING_SLIDESHOW_INIT
  };
};

export const fetching_slideshow_success = (result) => {
  return {
    type: actionTypes.FETCHING_SLIDESHOW_SUCCESS,
    result: result
  };
};

export const fetching_slideshow_fail = (ex) => {
  return {
    type: actionTypes.FETCHING_SLIDESHOW_ERROR,
    errormessage: ex
  };
};

export const findFirstInteractableSlide = (slides) => {
  return (
    slides.find((slide) => {
      return (
        slide.interactions.length === 0 ||
        !slide.interactions.some((interaction) => interaction.isAccepted)
      );
    }) || slides[0]
  );
};

export const fetch_slideshow = (slideshowId) => {
  return async function(dispatch) {
    dispatch(fetching_slideshow_init());
    httpService
      .get(`${apiUrl}/content/slideshow/${slideshowId}`)
      .then((response) => {
        console.log(response.data);

        dispatch(fetching_slideshow_success(response.data));
        return findFirstInteractableSlide(response.data.slides);
      })
      .then((slide) => {
        dispatch(start_slideshow(slideshowId, slide._id));
      })
      .catch((ex) => {
        dispatch(
          fetching_slideshow_fail("Caught ex in fetch_slideshow: " + ex.message)
        );
      });
  };
};

///// Get slide show by id by teacher for a specific student //////////////////
// export const fetch_slideshow = (slideshowId, studentId) => {
//   const studentSide = `${apiUrl}/content/slideshow/${slideshowId}`;
//   const teacherSide = `${apiUrl}/content/slideshow/${slideshowId}/student/${studentId}`;
//   return async function(dispatch) {
//     dispatch(fetching_slideshow_init());
//     httpService
//       .get(!studentId ? studentSide : teacherSide)
//       .then(response => {
//         setTimeout(
//           () => dispatch(fetching_slideshow_success(response.data)),
//           Math.random() * 0 + 0
//         );
//         return response.data.slides[0];
//       })
//       .then(slide => {
//         dispatch(start_slideshow(slideshowId, slide._id));
//       })
//       .catch(ex => {
//         dispatch(
//           fetching_slideshow_fail("Caught ex in fetch_slideshow: " + ex.message)
//         );
//       });
//   };
// };
