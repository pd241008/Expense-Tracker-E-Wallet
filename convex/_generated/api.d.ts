/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as category from "../category.js";
import type * as monthhistory from "../monthhistory.js";
import type * as transactions from "../transactions.js";
import type * as user from "../user.js";
import type * as usersetting from "../usersetting.js";
import type * as yearhistory from "../yearhistory.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  category: typeof category;
  monthhistory: typeof monthhistory;
  transactions: typeof transactions;
  user: typeof user;
  usersetting: typeof usersetting;
  yearhistory: typeof yearhistory;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
