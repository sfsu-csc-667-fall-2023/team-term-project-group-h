const database = require("../connection");
const { connection: db } = database;

const GET_USERS = `
SELECT gu.user_id, gu.seat, gu.game_points, gu.hand_points, gu.all_points,
(SELECT sid FROM session
 WHERE (sess->'user'->>'id')::int = gu.user_id
 ORDER BY expire DESC
 LIMIT 1
) as sid,
u.username  -- Include the username from the users table
FROM game_users gu
JOIN users u ON gu.user_id = u.id
WHERE gu.game_id = $1;
`;

const getUsers = (gameId) => db.many(GET_USERS, [gameId]);

module.exports = { getUsers };