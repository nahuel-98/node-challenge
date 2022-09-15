/**
 * @swagger
 * components:
 *   schemas:
 *     NumericFilter:
 *       type: object
 *       properties:
 *         eq:
 *           type: integer
 *           nullable: true
 *           description: Matches items equal to the indicated value.
 *           example: 14
 *         lt:
 *           type: integer
 *           nullable: true
 *           description: Matches items less than to the indicated value.
 *           example: 40
 *         gt:
 *           type: integer
 *           nullable: true
 *           description: Matches items greater than the indicated value.
 *           example: 13
 *         lte:
 *           type: integer
 *           nullable: true
 *           description: Matches items less or equal than the indicated value.
 *           example: 20
 *         gte:
 *           type: integer
 *           nullable: true
 *           description: Matches items greater or equal than the indicated value.
 *           example: 10
 */

/**
 * For filtering number properties, for example, age.
 */
type NumericFilter = {
  /**
   * 'Equals' filter.
   */
  eq?: number | null;

  /**
   * 'Less than' filter.
   */
  lt?: number | null;

  /**
   * 'Greater than' filter.
   */
  gt?: number | null;

  /**
   * 'Less or equal than' filter.
   */
  lte?: number | null;

  /**
   * 'Greater or equal than' filter.
   */
  gte?: number | null;
};

export default NumericFilter;
