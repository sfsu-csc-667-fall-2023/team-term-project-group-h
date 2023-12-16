[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=12497924)

Requirements:
1. Must have PSQL installed and Node.
2. Create an .env file with DATABASE_URL for psql connection and SESSION_SECRET to any type of string.
3. run npm install to install all dependencies and migrations.
4. To run the website run the following command: npm run start:dev
5. Game requires 4 different browsers to be ran.

Demonstration: can be found in demo folder.

Welcome To Hearts Game

Game Rules:

1. The objective of Hearts is to get as few points as possible. Each heart gives one penalty point. There is also one special card, the Queen of spades, which gives 13 penalty points.

2. When the game starts you select 3 cards to pass to one of your opponents. Typically you want to pass your three worst cards to get rid of them. Which opponent you pass to varies, you start by passing to the opponent on your left, then in the next game you pass to the opponent on your right, third game you pass across the table and in the fourth game there is no card passing.

3. Each turn starts with one player playing a single card, also called leading. The suit of that card determines the suit of the trick. The other players then play one card each. If they have a card in the same suit as the first card then they must play that. If they don't then they can play one of their other cards. Once four cards have been played, the player who played the highest ranking card in the original suit takes the trick, i.e. he takes the four cards on the table and he then starts the next turn. Any penalty cards in the trick (hearts or queen of spades) are added to the players penalty score. So you want to avoid taking any tricks that have hearts or the queen of spades.

4. The player who has the two of clubs at the start of the game leads in the first hand, and he MUST lead with the two of clubs.

5. You cannot lead a trick with hearts, until hearts has been broken (played on another suit). So if it is your turn to lead and no heart has been played yet then you may not select a heart as the card to play first. In some variations of the game you can't play the queen of spades until hearts has been broken as well, but in this version you can always play the queen of spades and she doesn't break hearts.

6. In the very first round you may never play a heart or the queen of spades, not even if you don't have any card in the suit of the lead card.

7. Once all cards have been played the penalty points are counted and the player with the fewest points wins that hand. When one or more players reach 100 points or more then the entire game is finished, and the player with the least points win. If points are over 100 and there are two or more equal with the least points then play continues until there's only one winner.

