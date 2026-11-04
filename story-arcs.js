/* Story arcs for the Chapters app (chapters.js).
   Every arc has 12 chapters. To add a future arc, append an object to window.STORY_ARCS with the
   same shape as ARC 1 below (or flip an existing `comingSoon` entry to a full arc).

   Chapter shape
     title, teaser             shown in the chapter list
     recap                     one line, fed to live AI so Alfie and friends remember what happened
     scenes                    array of:
                                 'plain string'                 narration
                                 { from: 'Name', text: '...' }  a text message (from 'Alfie' = his side)
                                 { if: 'flag', ... } / { unless: 'flag', ... }  only shows for some choices
     choice (optional)         { prompt, options: [{ label, set: 'flag', result: 'what happens' }] }
     after (optional)          phone updates that land a little after the chapter is finished:
                                 { app: 'messages'|'discord'|'forums'|'newspaper'|'school'|'neoblog', from, text }
*/
window.STORY_ARCS = [
  {
    id: 'silver-ring',
    number: 1,
    title: 'The Silver Ring',
    tagline: 'A prop that isn\'t a prop. A library made of stars. A very busy sophomore year.',
    cover: '💍',
    colors: ['#2a1f5c', '#b0306a'],
    chapters: [
      {
        title: 'Wrap Party',
        teaser: 'Season two is done. Alfie is going home with one more thing than he came with.',
        recap: 'At the season two wrap party Alfie found a silver ring by the costume racks. It glowed when he touched it.',
        scenes: [
          'The wrap party is in a rented loft in Tribeca with a sad cheese plate and very good cake. Alfie spends most of it thanking crew members one by one, getting three names wrong and one name very right.',
          'On the way out he passes the costume racks. Something silver is sitting on the floor under the last rack, like it rolled there on purpose.',
          'It\'s a ring. Heavy, cold, with a thin line of light running around the inside. It brightens when he picks it up. Not a reflection. It brightens.',
          { from: 'Maya', text: 'where did you go, they\'re doing speeches' },
          { from: 'Alfie', text: 'coming. found a prop. i think' }
        ],
        choice: {
          prompt: 'The ring is still glowing in his palm.',
          options: [
            { label: 'Put it in his pocket. Return it to wardrobe tomorrow.', set: 'kept_ring', result: 'He pockets it. It stays warm the whole subway ride home, which he decides not to think about.' },
            { label: 'Leave it with the lost-and-found box by the door.', set: 'left_ring', result: 'He drops it in the lost-and-found box and goes home. The next morning it\'s in his jacket pocket. He did not put it there.' }
          ]
        },
        after: [
          { app: 'messages', from: 'Alfie', text: 'ok weird question. do props ever just. glow' },
          { app: 'discord', from: 'maya', text: 'alfie left the wrap party early and missed the speech where they thanked him. classic' }
        ]
      },
      {
        title: 'Jellyfish in the Bedroom',
        teaser: 'Something is floating near the ceiling. Anne-Marie has noticed.',
        recap: 'Small glowing jellyfish-like lights appeared in Alfie\'s bedroom at night when the ring glowed. Anne-Marie the cat saw them too.',
        scenes: [
          '2:14 AM. Alfie wakes up because Anne-Marie is standing on his chest staring at the ceiling.',
          'There are lights up there. Soft, blue-white, drifting. They have little trailing tails like jellyfish, and they pulse in the same rhythm as the ring on his nightstand.',
          'One of them drifts down close enough that he can see it isn\'t really made of anything. It\'s more like a drawing of light. It hums one low note, the same note he\'s been stuck on in song #31.',
          'Anne-Marie swats at it. Her paw goes straight through. She looks deeply offended.'
        ],
        choice: {
          prompt: 'His phone is right there.',
          options: [
            { label: 'Film it. Nobody will believe this otherwise.', set: 'filmed', result: 'He films eleven seconds. On playback the video is just his ceiling and Anne-Marie\'s ear, and the audio is that one low note.' },
            { label: 'Don\'t move. Just watch.', set: 'watched', result: 'He doesn\'t move. After a while the lights settle around the ring like they\'re guarding it, and he falls asleep watching them.' }
          ]
        },
        after: [
          { app: 'messages', from: 'Alfie', text: 'my cat and i saw something last night and we\'re both not ok' },
          { app: 'forums', from: 'Anonymous', text: 'does anyone else hear one random note in their head at night or is that just a theatre kid thing' }
        ]
      },
      {
        title: 'White Streaks',
        teaser: 'Riley is worried about continuity. Charlotte is worried about Alfie.',
        recap: 'Alfie woke up with new white streaks in his coral-orange hair. His manager Riley worried about continuity and Charlotte noticed he was scared.',
        scenes: [
          'The mirror is not being nice this morning. Two clean white streaks run through his coral-orange hair, right at the front, like someone painted them.',
          { from: 'Riley', text: 'ALFIE. did you dye your hair. we have pickups friday' },
          { from: 'Alfie', text: 'no?? i woke up like this' },
          { from: 'Riley', text: 'that\'s a song lyric not an explanation' },
          'At lunch Charlotte doesn\'t say anything for a full minute. Then she reaches over and tucks one streak behind his ear and asks, quietly, if he\'s okay.'
        ],
        choice: {
          prompt: 'Charlotte is waiting for an answer.',
          options: [
            { label: 'Tell her the truth. All of it, even the jellyfish.', set: 'told_charlotte', result: 'He tells her everything. She doesn\'t laugh. She asks to see the ring, holds it for a second, and says "ok. so we figure it out." We.' },
            { label: 'Say it\'s a dye job for a role.', set: 'hid_from_charlotte', result: '"It\'s for a role," he says. Charlotte nods slowly, in the way that means she\'s going to bring it up again later.' }
          ]
        },
        after: [
          { app: 'neoblog', from: 'Alfie', text: 'new hair. didn\'t ask for it. kind of into it though' },
          { app: 'school', from: 'priya.sings', text: 'alfie\'s streaks are giving main character. who did them' }
        ]
      },
      {
        title: 'Not Ours',
        teaser: 'Wardrobe has never seen this ring before. Neither has anyone else.',
        recap: 'Wardrobe confirmed the ring was never a prop. Maya helped Alfie check the wrap party photos and the inside of the ring showed the word STELLARIS.',
        scenes: [
          'Wardrobe has a binder for every piece of jewelry used on set. Every ring, every earring, every fake wedding band. The ring is not in the binder.',
          '"Not ours, hon," says the head of wardrobe, handing it back like it might bite. "And I would remember that."',
          'Maya goes through every photo from the wrap party with him in the green room, eating crackers. The racks are in the background of six photos. In five of them, there\'s nothing on the floor. In the sixth, there\'s a faint blue smear right where he found it.',
          'That night the light inside the ring shifts. Tiny marks crawl along the band and rearrange themselves until he can read them: STELLARIS.',
          { from: 'Alfie', text: 'maya what does stellaris mean' },
          { from: 'Maya', text: 'like stars? latin? why' },
          { from: 'Alfie', text: 'no reason' }
        ],
        after: [
          { app: 'discord', from: 'jules_tech', text: 'wardrobe is acting so weird today. someone asked about a ring and the head of wardrobe did the sign of the cross' },
          { app: 'messages', from: 'Alfie', text: 'the ring has a word on it now. it didn\'t before' }
        ]
      },
      {
        title: 'Lights by the River',
        teaser: 'The Borough Beacon has a story. Alfie is in it, kind of.',
        recap: 'The ring pulled Alfie to the riverside path where the Beacon had reported strange lights. Dozens of the jellyfish lights gathered over the water.',
        scenes: [
          'The Borough Beacon runs a little piece: lights by the riverside path, witnesses "with questions." One Starlight student is quoted saying it was "like a film effect, except nobody was filming." The student is Nate. Of course it\'s Nate.',
          'At 9 PM the ring gets warm and heavy, and tugs. Not a metaphor. It actually tugs his hand toward the river.'
        ],
        choice: {
          prompt: 'He\'s going. The question is who comes with him.',
          options: [
            { label: 'Text Maya. She\'s fearless and has a flashlight.', set: 'brought_maya', result: 'Maya shows up in four minutes with a flashlight, a granola bar and zero questions. "Walk," she says.' },
            { label: 'Go alone, with Charlotte on FaceTime.', set: 'went_alone', result: 'He goes alone, with Charlotte on FaceTime in his pocket. Every few minutes she says "still there?" and he says "still here."' }
          ]
        },
        scenesAfterChoice: [
          'The path is empty. Then it isn\'t. Dozens of the jellyfish lights rise off the water, slow and silent, and form a ring the exact size of a doorway.',
          'Somebody is standing in it.'
        ],
        after: [
          { app: 'newspaper', from: 'riverwalker88', text: 'saw them again tonight. bigger. like a door. not joking' },
          { app: 'messages', from: 'Alfie', text: 'i went to the river. i need to tell you something but i need to sleep first' }
        ]
      },
      {
        title: 'The Archivist',
        teaser: 'She says she\'s a librarian. Of the stars. Who got kicked out.',
        recap: 'Alfie met Lyre, an exiled celestial archivist. She explained the ring is a key to Stellaris, an archive that holds the memories of stars, and that it chose him.',
        scenes: [
          'She\'s tall, wrapped in something that looks like a coat until it moves like a nebula. She looks tired. She looks like she\'s been waiting a long time.',
          '"My name is Lyre," she says. "I was an archivist of Stellaris. I am not, currently. Long story."',
          '"That\'s what I always say," says Alfie, before he can stop himself.',
          'Stellaris, she explains, is a library. Every star that has ever burned leaves a memory, and the archive keeps them. The ring is a key. Keys choose their keepers. It chose him at a wrap party, which she seems to find slightly embarrassing.',
          '"Why me?"',
          '"You spend your whole life remembering other people\'s stories," Lyre says. "And you thank the crew."',
          { if: 'brought_maya', text: 'Maya, very quietly: "I\'m going to need you to explain this to me later. With diagrams."' },
          { if: 'went_alone', text: 'From his pocket, Charlotte\'s voice: "Alfie. Is that a person. Are you talking to a person made of space."' }
        ],
        after: [
          { app: 'messages', from: 'Alfie', text: 'so the ring is a library key. i\'m not joking. i\'m too tired to joke' },
          { app: 'discord', from: 'nate', text: 'update on the river lights: i went back and found NOTHING. alfie why are you so quiet in here' }
        ]
      },
      {
        title: 'Echoes',
        teaser: 'Newfound abilities, tested in the worst possible place: an audition.',
        recap: 'Alfie discovered the ring lets him hear echoes, memories left in places and objects. He heard an old actor\'s echo in the black box theatre.',
        scenes: [
          'Lyre calls it "listening." Alfie calls it "hearing ghosts," and she says that\'s rude to the ghosts.',
          'In the black box theatre he presses the ring to the edge of the stage. Suddenly the room is full: a hundred rehearsals at once, laughter, a dropped line, someone in 1987 crying in the wings and then going on anyway and being brilliant.',
          'It\'s overwhelming. It\'s also the best acting lesson he\'s ever had.',
          'He has an audition on Thursday. A grieving brother. He has never lost a brother. But the room remembers people who have.'
        ],
        choice: {
          prompt: 'Thursday, audition room. The ring is on his finger.',
          options: [
            { label: 'Listen to the room. Use what it remembers.', set: 'used_echo', result: 'He listens. The scene comes out of him like it\'s been waiting. The casting director puts her pen down. Afterward he feels hollow, like he borrowed something he can\'t give back.' },
            { label: 'Take the ring off. Do it himself.', set: 'own_work', result: 'He slips the ring into his pocket and does the scene with just himself. It\'s good. Not perfect. His. He walks out lighter than he walked in.' }
          ]
        },
        after: [
          { app: 'neoblog', from: 'Alfie', text: 'audition today. i think it went ok?? don\'t ask what it was for, can\'t say' },
          { app: 'messages', from: 'Alfie', text: 'can i ask you something weird. if you could hear what a room remembers would you want to' }
        ]
      },
      {
        title: 'Tech Week',
        teaser: 'The lights go out. Then they come back in colors that don\'t exist.',
        recap: 'During tech week the ring flared and blew out the stage lights. Jules from stage crew covered for Alfie and the show kept going.',
        scenes: [
          'Tech week is twelve-hour days, cold pizza and Jules yelling about the fog machine. Alfie is tired in his bones.',
          'Mid-cue, the ring flares. Every light in the rig pops at once, then comes back on in a color Jules will later describe as "if purple had a secret."',
          'Twenty people look at the stage. Alfie has his hand behind his back.',
          '"Power surge," Jules announces, immediately, loudly. "This building is a hundred years old. Everybody take five."',
          'Later, coiling cable: "I don\'t want to know," says Jules. "But if it happens on opening night, give me a signal. Tug your ear or something."',
          { if: 'told_charlotte', text: 'Charlotte texts the moment she hears: "was that you." He sends back one jellyfish emoji. She sends back "ok. call me after."' },
          { if: 'hid_from_charlotte', text: 'Charlotte texts: "heard the lights blew at your rehearsal. you\'re ok?" He types the truth, deletes it, sends "yeah lol old building."' }
        ],
        after: [
          { app: 'discord', from: 'jules_tech', text: 'for the record the lights were a POWER SURGE. nobody ask me about the color' },
          { app: 'school', from: 'nate', text: 'the purple during tech was so sick can we keep it for the show' }
        ]
      },
      {
        title: 'Vancouver Calling',
        teaser: 'The family group chat is loud. Liliana is very quiet.',
        recap: 'On a video call with his family in Vancouver, Alfie learned his little sister Liliana had been drawing the jellyfish lights for weeks.',
        scenes: [
          'Sunday family call. Fourteen faces in a grid, the twins fighting over a tablet, Tobias eating on camera, Dad asking if he\'s eating, Mom asking about the hair.',
          'Liliana doesn\'t say anything. She just holds up a drawing to the camera.',
          'Blue crayon jellyfish. A lot of them. Floating around a ring.',
          '"She\'s been drawing those for weeks," Mom says. "We thought it was from a cartoon."',
          'The ring on his finger goes warm.'
        ],
        choice: {
          prompt: 'His whole family is on the call.',
          options: [
            { label: 'Tell them. Mom always knows anyway.', set: 'told_family', result: 'He tells them. There is a long silence, then Valerie says "I KNEW the hair wasn\'t dye," and the group chat explodes for three hours.' },
            { label: 'Not yet. Call Liliana privately later.', set: 'kept_from_family', result: 'He says the drawing is cool. That night he calls Liliana alone, and she whispers, "they told me you\'d need help." He doesn\'t sleep much.' }
          ]
        },
        after: [
          { app: 'messages', from: 'Alfie', text: 'my little sister has been drawing my jellyfish. from vancouver. i didn\'t tell her about them' },
          { app: 'neoblog', from: 'Alfie', text: 'family call today. miss them so much it\'s actually physical' }
        ]
      },
      {
        title: 'The Hollow',
        teaser: 'Something wants the key. It doesn\'t have a face. It has a draft.',
        recap: 'Alfie learned about the Hollow, a cold presence that erases memories and wants the ring. Lyre was exiled for trying to warn the archive about it.',
        scenes: [
          'It starts small. Nate forgets his lines, lines he\'s known for a month. Priya can\'t remember the melody she wrote. The Beacon article about the river is gone from the website like it was never there.',
          'The jellyfish lights cluster around Alfie\'s bed every night now, close and anxious.',
          '"The Hollow," Lyre says. Her coat goes dark. "It eats memory. Stories, songs, names. Stellaris is the biggest meal there is, and you are holding the door."',
          '"Is that why they kicked you out?"',
          '"I told them it was coming. They didn\'t want to remember that either."'
        ],
        choice: {
          prompt: 'Lyre offers to teach him to fight it. It will take everything he has.',
          options: [
            { label: 'Ask Lyre to train him, starting tonight.', set: 'trained', result: 'They train on the roof until 3 AM. He learns to hold one memory so hard the cold can\'t touch it. He chooses the first time Charlotte laughed at his bad subway joke.' },
            { label: 'Ask his friends for help instead of doing it alone.', set: 'asked_friends', result: 'He brings everyone into the green room: Maya, Jules, Priya, Nate. He tells them as much as he can. Nate says "I KNEW IT." Jules says "ok. what\'s the plan."' }
          ]
        },
        after: [
          { app: 'forums', from: 'Anonymous', text: 'is it just me or is everyone forgetting stuff this week. like weirdly a lot' },
          { app: 'discord', from: 'priya.sings', text: 'i literally cannot remember the bridge to my own song. it\'s gone. i wrote it' }
        ]
      },
      {
        title: 'Opening Night',
        teaser: 'Full house. Full moon. Full Hollow.',
        recap: 'On opening night the Hollow came for the ring during the show. Alfie held the performance together while protecting the key.',
        scenes: [
          'Opening night. The house is sold out. Charlotte is in row F. The air backstage is cold in a way the heaters can\'t fix.',
          'Halfway through act one, the cold arrives. The audience doesn\'t see it. Alfie does: a gap in the air at the back of the theatre, like a page with the words scraped off.',
          'The lines start slipping out of everyone\'s heads. He feels his own going.',
          { if: 'trained', text: 'He holds the memory Lyre taught him to hold. Charlotte laughing. Subway map. Bad joke. It burns warm against the cold, and the gap flinches.' },
          { if: 'asked_friends', text: 'He tugs his ear. Jules hits a cue that isn\'t in the script, and the stage floods with secret-purple light. Maya feeds lines from the wings. Nate, for the first time in his life, is early.' },
          { if: 'used_echo', text: 'He listens to the theatre, and the theatre answers: a hundred years of opening nights, every actor who ever stood here and kept going. They all remember their lines, so he does too.' },
          { if: 'own_work', text: 'He doesn\'t reach for the ring. He reaches for what he knows: the scene, his scene, rehearsed a hundred times. The Hollow can take borrowed things. It can\'t take what he actually learned.' },
          'The jellyfish pour out of the ring, hundreds of them, and the audience gasps because they think it\'s the best effect they\'ve ever seen.'
        ],
        after: [
          { app: 'newspaper', from: 'theatre_mom_ny', text: 'went to the starlight show tonight and the lighting effect in act one made me cry. how did a high school DO that' },
          { app: 'discord', from: 'nate', text: 'i was EARLY. write it down. i want it on my grave' },
          { app: 'messages', from: 'Alfie', text: 'we did it. i think. i\'m shaking. charlotte got me a donut' }
        ]
      },
      {
        title: 'Starlight',
        teaser: 'A library needs a keeper. A sophomore needs to sleep.',
        recap: 'After opening night Lyre offered Alfie a choice about the ring and the archive. Alfie made his choice and the first arc ended.',
        scenes: [
          'The roof of Starlight, 1 AM. The city is loud below. The jellyfish drift lazily, like they\'re off duty.',
          'Lyre looks different. Less tired. "The Hollow is gone for now. Stellaris noticed what you did. They\'re reconsidering a few things. Including me."',
          { if: 'told_charlotte', text: 'Charlotte is sitting next to him, wearing his hoodie, holding his hand. She\'s been here for all of it.' },
          { if: 'hid_from_charlotte', text: 'His phone buzzes. Charlotte: "i know it wasn\'t a dye job. tell me when you\'re ready. i\'ll be here." He reads it four times.' },
          { if: 'told_family', text: 'The family group chat has 213 unread messages. Most of them are Valerie. One of them is a crayon drawing from Liliana: him, on a stage, surrounded by stars.' },
          { if: 'kept_from_family', text: 'Liliana texts from Mom\'s phone: "they said you did good." He\'s going to have to tell everyone eventually. Maybe at Christmas. Maybe with a slideshow.' },
          '"The ring is yours if you want it," Lyre says. "Keeper of the key. It won\'t be quiet. It won\'t be normal."',
          '"My life isn\'t normal," says Alfie. "I have a horse in a city."'
        ],
        choice: {
          prompt: 'The ring is warm on his finger, waiting.',
          options: [
            { label: 'Keep it. Become the keeper.', set: 'keeper', result: 'He keeps it. Lyre bows, a real bow, the kind archivists give each other. "Then we start Monday," she says. "Bring snacks." The ring glows silver, steady, like a heartbeat.' },
            { label: 'Give it back. He\'s sixteen.', set: 'returned', result: 'He holds it out. Lyre smiles and closes his fingers around it. "Keys don\'t go back," she says. "But you can rest. It will wait until you\'re ready." The ring dims, softly, like it\'s letting him sleep.' }
          ]
        },
        ending: 'END OF ARC 1. Alfie\'s story keeps going. The next arc picks up from what you chose.',
        after: [
          { app: 'neoblog', from: 'Alfie', text: 'i think i just finished the weirdest month of my life. going to sleep for 3 days. love you guys' },
          { app: 'messages', from: 'Alfie', text: 'hey. thanks for sticking around through all this. like actually' }
        ]
      }
    ]
  },
  {
    id: 'momosu',
    number: 2,
    title: 'Five Months on Momosu',
    tagline: 'A shoot on a faraway island. A ring that won\'t stop humming. Coming soon.',
    cover: '🏝️',
    colors: ['#0f5a6e', '#ff9a6b'],
    comingSoon: true,
    chapters: []
  },
  {
    id: 'arc-3',
    number: 3,
    title: 'Untitled Arc',
    tagline: 'Still being written. Alfie says "no spoilers," mostly because he doesn\'t know either.',
    cover: '✦',
    colors: ['#3a3f52', '#6b7392'],
    comingSoon: true,
    chapters: []
  }
];
