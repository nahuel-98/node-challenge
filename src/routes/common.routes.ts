/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     PaginationResult:
 *       type: object
 *       required:
 *         - data
 *         - totalPages
 *         - total
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *           description: List of items in the current page.
 *         totalPages:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *           description: Total pages in the current query.
 *         total:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *           description: Total items in the current query
 *         previous:
 *           type: string
 *           format: url
 *           example: '/resource?limit=1&page=1'
 *           description: Link to previous page
 *         next:
 *           type: string
 *           format: url
 *           example: '/resource?limit=1&page=3'
 *           description: Link to next page
 */

import { Router } from 'express';

/**
 * Defines properties common to all route classes.
 */
export default abstract class CommonRoutes {
  private basePath: string;
  protected router: Router;

  public constructor(basePath: string) {
    this.basePath = basePath;
    this.router = Router();
  }

  /**
   * Adds routes to express router.
   */
  protected abstract setUpRoutes(): void;

  /**
   * Gets Express router
   */
  public getRouter() {
    return this.router;
  }

  /**
   * Gets roter's base path.
   */
  public getBasePath() {
    return this.basePath;
  }
}
