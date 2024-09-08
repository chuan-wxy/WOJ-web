import type { BaseResponsePageProblemTitleVO } from "../models/BaseResponsePageProblemTitleVO";
import type { BaseResponseString } from "../models/BaseResponseString";
import type { ProblemAddDTO } from "../models/ProblemAddDTO";
import type { TagAddDTO } from "../models/TagAddDTO";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";

export class ProblemControllerService {
  /**
   * @param requestBody
   * @returns BaseResponseString OK
   * @throws ApiError
   */
  public static addTag(
    requestBody: TagAddDTO
  ): CancelablePromise<BaseResponseString> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/problem/add-tag",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param requestBody
   * @returns BaseResponseString OK
   * @throws ApiError
   */
  public static addProblem(
    requestBody: ProblemAddDTO
  ): CancelablePromise<BaseResponseString> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/problem/add-problem",
      body: requestBody,
      mediaType: "application/json",
    });
  }

  /**
   * @param current
   * @param size
   * @param id
   * @param tags
   * @param difficulty
   * @param title
   * @returns BaseResponsePageProblemTitleVO OK
   * @throws ApiError
   */
  public static searchProblemTitleTwo(
    current: number,
    size: number,
    id: number,
    tags: string,
    difficulty: string,
    title: string
  ): CancelablePromise<BaseResponsePageProblemTitleVO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/problem/search-problemtitlelist",
      query: {
        current: current,
        size: size,
        id: id,
        tags: tags,
        difficulty: difficulty,
        title: title,
      },
    });
  }

  /**
   * @param current
   * @param size
   * @param text
   * @returns BaseResponsePageProblemTitleVO OK
   * @throws ApiError
   */
  public static searchProblemTitleOne(
    current: number,
    size: number,
    text: string
  ): CancelablePromise<BaseResponsePageProblemTitleVO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/problem/search-problemtitle",
      query: {
        current: current,
        size: size,
        text: text,
      },
    });
  }

  /**
   * @param size
   * @param current
   * @returns BaseResponsePageProblemTitleVO OK
   * @throws ApiError
   */
  public static getProblemTitle(
    size?: number,
    current?: number
  ): CancelablePromise<BaseResponsePageProblemTitleVO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/problem/get-problemtitle",
      query: {
        size: size,
        current: current,
      },
    });
  }
}
