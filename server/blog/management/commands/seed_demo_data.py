from datetime import date, timedelta, time
import random

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

from blog.models import Category, Series, Season, Post, Event, Comment, Like


class Command(BaseCommand):
    help = "Seed demo data for categories, series, seasons, posts, events, comments, and likes"

    def handle(self, *args, **options):
        User = get_user_model()
        
        # 1. Users
        users_data = [
            {
                "email": "singhaladitya611@gmail.com",
                "username": "aditya",
                "first_name": "Aditya",
                "last_name": "Singhal",
                "bio": "Founder of Mind Matrix. Obsessed with design systems, clean code, and human cognitive enhancement.",
                "location": "India",
                "website": "https://github.com/adi-0903",
                "twitter": "aditya_singhal",
                "github": "adi-0903",
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "email": "demo@example.com",
                "username": "demo",
                "first_name": "Demo",
                "last_name": "User",
                "bio": "Blogger and designer explorer. Documenting thoughts on the future of design and travel.",
                "location": "San Francisco, CA",
                "website": "https://example.com",
                "twitter": "demo_user",
                "github": "demo-github",
                "is_staff": True,
            },
            {
                "email": "elena@example.com",
                "username": "elena",
                "first_name": "Elena",
                "last_name": "Rostova",
                "bio": "Travel writer & photojournalist. Capturing the essence of cities and cultures through long-form essays.",
                "location": "Prague, Czech Republic",
                "website": "https://elena-rostova.com",
                "twitter": "elena_travels",
                "github": "elena-photo",
            },
            {
                "email": "marcus@example.com",
                "username": "marcus",
                "first_name": "Marcus",
                "last_name": "Chen",
                "bio": "Senior UX Designer & Technologist. Exploring how modern tools, AI, and aesthetics shape human experiences.",
                "location": "Stockholm, Sweden",
                "website": "https://marcuschen.design",
                "twitter": "marcus_ux",
                "github": "marcus-design",
            },
            {
                "email": "aisha@example.com",
                "username": "aisha",
                "first_name": "Aisha",
                "last_name": "Diallo",
                "bio": "Essayist, poet, and tech enthusiast. Writing at the intersection of cultural heritage and digital futures.",
                "location": "Dakar, Senegal",
                "website": "https://aishadiallo.dev",
                "twitter": "aisha_diallo",
                "github": "aisha-diallo",
            }
        ]

        users = {}
        for u_data in users_data:
            email = u_data["email"]
            username = u_data["username"]
            
            user = User.objects.filter(email=email).first()
            if not user:
                user = User.objects.filter(username=username).first()
                
            if user:
                user.first_name = u_data.get("first_name", user.first_name)
                user.last_name = u_data.get("last_name", user.last_name)
                user.bio = u_data.get("bio", user.bio)
                user.location = u_data.get("location", user.location)
                user.website = u_data.get("website", user.website)
                user.twitter = u_data.get("twitter", user.twitter)
                user.github = u_data.get("github", user.github)
                user.save()
                self.stdout.write(f"Updated user: {username}")
            else:
                password = "demo1234"
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    first_name=u_data["first_name"],
                    last_name=u_data["last_name"],
                    bio=u_data["bio"],
                    location=u_data["location"],
                    website=u_data["website"],
                    twitter=u_data["twitter"],
                    github=u_data["github"],
                    is_staff=u_data.get("is_staff", False),
                    is_superuser=u_data.get("is_superuser", False),
                )
                user.set_password(password)
                user.save()
                self.stdout.write(f"Created user: {username} (password: {password})")
            users[username] = user

        # 2. Categories
        category_names = ["Culture", "Travel", "Design", "Opinion", "Personal", "Technology"]
        categories = {}
        for name in category_names:
            cat, _ = Category.objects.get_or_create(name=name)
            categories[name] = cat
        self.stdout.write(f"Ensured {len(categories)} categories")

        # Clear existing entries before recreating to keep seed clean
        Post.objects.all().delete()
        Season.objects.all().delete()
        Series.objects.all().delete()
        Event.objects.all().delete()
        self.stdout.write("Cleared existing posts, seasons, series, and events for clean seeding.")

        # 3. Series & Seasons
        series_data = [
            {
                "title": "Writers on the Road",
                "subtitle": "Stories from journeys that shaped us",
                "description": "A collection of essays about travel, identity, and creative discovery.",
                "icon": "🌍",
                "status": "active",
                "tags": "travel,identity,stories",
                "gradient": "linear-gradient(135deg, #6dd5ed, #2193b0)",
                "accent_color": "#2193b0",
                "author": users["elena"],
                "seasons": [
                    {
                        "title": "Wandering Minds",
                        "season_number": 1,
                        "description": "First season covering the transit across European cities and personal growth."
                    },
                    {
                        "title": "Eastern Reflections",
                        "season_number": 2,
                        "description": "Second season exploring historical depths in Kyoto and Hanoi."
                    }
                ]
            },
            {
                "title": "Design Futures",
                "subtitle": "Where craft meets technology",
                "description": "Exploring the evolving landscape of design, tools, and digital storytelling.",
                "icon": "🎨",
                "status": "active",
                "tags": "design,technology,craft",
                "gradient": "linear-gradient(135deg, #b993d6, #8ca6db)",
                "accent_color": "#8ca6db",
                "author": users["marcus"],
                "seasons": [
                    {
                        "title": "Designing with AI",
                        "season_number": 1,
                        "description": "How machine learning models reshape creative tools and user interface design."
                    }
                ]
            },
            {
                "title": "The Minimalist Developer",
                "subtitle": "Simplicity in code and life",
                "description": "A series on reducing complexity, focused writing, and intentional technology.",
                "icon": "💻",
                "status": "completed",
                "tags": "coding,minimalism,lifestyle",
                "gradient": "linear-gradient(135deg, #2c3e50, #bdc3c7)",
                "accent_color": "#2c3e50",
                "author": users["aditya"],
                "seasons": [
                    {
                        "title": "Decluttering the Stack",
                        "season_number": 1,
                        "description": "Removing bloated libraries and focusing on raw performance and usability."
                    }
                ]
            }
        ]

        series_map = {}
        season_map = {}
        for s_data in series_data:
            seasons = s_data.pop("seasons")
            author = s_data.pop("author")
            s_obj = Series.objects.create(author=author, **s_data)
            series_map[s_obj.title] = s_obj
            season_map[s_obj.title] = {}
            for se_data in seasons:
                se_obj = Season.objects.create(series=s_obj, **se_data)
                season_map[s_obj.title][se_obj.season_number] = se_obj

        self.stdout.write("Created series and seasons successfully.")

        # 4. Posts (Blogs & Journals)
        now = timezone.now()
        post_data = [
            # Elena's Travel series
            {
                "title": "Finding Voice Between Cities",
                "excerpt": "On learning to listen to the silence between departures and arrivals.",
                "content": (
                    "# Finding Voice Between Cities\n\n"
                    "Travelling is often romanticized as a series of picturesque arrivals. We post photos of pristine canals in Amsterdam or glowing sunsets over Prague. But the real transformation happens in the quiet, awkward spaces in between: the overnight train rides, the hours spent waiting at bus depots, and the silence of a hotel room where nobody knows your name.\n\n"
                    "## The Beauty of Anonymity\n\n"
                    "There is a unique freedom in being completely anonymous. When you step off a train in a city where you don't speak the language, your past baggage disappears. You are forced to exist entirely in the present moment. For writers and creators, this clean slate is fertile ground.\n\n"
                    "- **It sharpens your observations**: you notice the smell of fresh coffee from a hidden alley or the peculiar rhythm of a foreign dialect.\n"
                    "- **It humbles you**: you realize the world functions perfectly fine without your daily worries.\n"
                    "- **It sparks new narratives**: you begin to imagine the lives of strangers passing you by.\n\n"
                    "## Crafting Your Own Journey\n\n"
                    "If you want to find your voice, sometimes you have to lose your comfort zone. Here are three ways to embrace the transit:\n\n"
                    "1. **Leave the itinerary behind**: Allow yourself to get lost in a safe neighborhood.\n"
                    "2. **Write in public transit**: Let the physical movement of a train or bus guide the rhythm of your words.\n"
                    "3. **Keep a sensory journal**: Write down sights, sounds, and textures rather than just events.\n\n"
                    "Travel isn't about escaping who you are. It's about meeting the versions of yourself that only wake up when you cross borders."
                ),
                "icon": "🌍",
                "author": users["elena"],
                "category": categories["Travel"],
                "series": series_map["Writers on the Road"],
                "season": season_map["Writers on the Road"][1],
                "episode_number": 1,
                "post_type": "blog",
                "status": "published",
                "is_featured": True,
                "read_time": 6,
                "views_count": 342,
                "likes_count": 89,
                "gradient": "linear-gradient(135deg, rgba(99, 221, 190, 0.2), rgba(76, 175, 215, 0.1))",
                "published_at": now - timedelta(days=12),
            },
            {
                "title": "Prague: A Symphony of Cobblestones",
                "excerpt": "A deep dive into the history, architectural layers, and secrets of the Golden City.",
                "content": (
                    "# Prague: A Symphony of Cobblestones\n\n"
                    "Prague is a city that demands you look up. From Gothic spires reaching towards the clouds like dark fingers, to pastel-colored Baroque facades that glow in the afternoon sun, the architecture tells a story of survival, art, and resilience.\n\n"
                    "## Walking the Old Town\n\n"
                    "Every cobblestone in Prague has a memory. If you walk early enough—before the throngs of tourists crowd the Charles Bridge—you can hear the quiet whisper of the Vltava River. It is in these moments that Prague feels less like a tourist destination and more like a living, breathing museum.\n\n"
                    "### The Alchemist's Legacy\n\n"
                    "Under the reign of Rudolf II, Prague became the world capital of alchemy and occult sciences. Today, that mystical energy still lingers in the winding alleys of the New World (Nový Svět) and the quiet corners of Prague Castle. To write here is to tap into that ancient search for gold—except our gold is made of sentences.\n\n"
                    "Prague doesn't let go of you easily. As Franz Kafka once wrote, 'Prague has claws.' Once it catches you, you will spend the rest of your life trying to return."
                ),
                "icon": "🏰",
                "author": users["elena"],
                "category": categories["Travel"],
                "series": series_map["Writers on the Road"],
                "season": season_map["Writers on the Road"][1],
                "episode_number": 2,
                "post_type": "blog",
                "status": "published",
                "is_featured": False,
                "read_time": 5,
                "views_count": 215,
                "likes_count": 52,
                "gradient": "linear-gradient(135deg, rgba(255, 177, 71, 0.2), rgba(255, 87, 34, 0.1))",
                "published_at": now - timedelta(days=8),
            },
            # Marcus's Design series
            {
                "title": "Sketching Tomorrow's Interfaces",
                "excerpt": "How designers can prototype feelings, spatial gestures, and emotional feedback, not just static screens.",
                "content": (
                    "# Sketching Tomorrow's Interfaces\n\n"
                    "As technology integrates deeper into our physical environments, the traditional screen is beginning to feel like a constraint. We are moving from a world of clicking buttons to a world of micro-gestures, voice interfaces, and spatial computing.\n\n"
                    "## Prototyping Feelings, Not Just Screens\n\n"
                    "In the early days of mobile design, the goal was visual clarity and navigation. Today, the challenge is emotional resonance. How does an interface feel when it responds to you?\n\n"
                    "- **Micro-animations**: A subtle bounce when a task is completed can evoke a feeling of accomplishment.\n"
                    "- **Gradients and Light**: Dynamic background gradients that shift based on the time of day make the app feel alive and contextual.\n"
                    "- **Tactile Feedback**: Haptic cues can create a sense of physical weight for digital assets.\n\n"
                    "## The Role of AI in Creative Craft\n\n"
                    "AI should not be seen as a replacement for human taste. Instead, it is the ultimate sparring partner. By generating layout variations instantly, it allows designers to spend less time pushing pixels and more time thinking about user agency and systemic ethics.\n\n"
                    "Design is not just what it looks like. It is how it behaves and how it makes us feel."
                ),
                "icon": "🎨",
                "author": users["marcus"],
                "category": categories["Design"],
                "series": series_map["Design Futures"],
                "season": season_map["Design Futures"][1],
                "episode_number": 1,
                "post_type": "blog",
                "status": "published",
                "is_featured": True,
                "read_time": 7,
                "views_count": 489,
                "likes_count": 143,
                "gradient": "linear-gradient(135deg, rgba(181, 169, 255, 0.2), rgba(120, 88, 255, 0.1))",
                "published_at": now - timedelta(days=10),
            },
            {
                "title": "Designing for Spatial Computing",
                "excerpt": "Exploring the canvas of three-dimensional space and physical light interaction in UI design.",
                "content": (
                    "# Designing for Spatial Computing\n\n"
                    "Designing for spatial computing requires throwing away the concept of 'the fold.' In a 3D interface, the canvas is the user's room, and the background is the physical world.\n\n"
                    "## Key Principles of Spatial UI\n\n"
                    "1. **Depth and Hierarchy**: Use Z-depth (closeness to the user) to represent active or primary elements, and shadows to ground elements in the real world.\n"
                    "2. **Eye and Gesture Tracking**: Interactive elements must hover or glow slightly when looked at, giving a subtle affordance before the pinch gesture occurs.\n"
                    "3. **Physical Light Casting**: Digital elements should cast light on local tables or walls, blurring the boundary between virtual and real.\n\n"
                    "We are no longer designing static pages; we are directing digital plays in physical spaces."
                ),
                "icon": "🕶️",
                "author": users["marcus"],
                "category": categories["Design"],
                "series": series_map["Design Futures"],
                "season": season_map["Design Futures"][1],
                "episode_number": 2,
                "post_type": "blog",
                "status": "published",
                "is_featured": False,
                "read_time": 8,
                "views_count": 198,
                "likes_count": 67,
                "gradient": "linear-gradient(135deg, rgba(163, 203, 255, 0.2), rgba(108, 156, 255, 0.1))",
                "published_at": now - timedelta(days=5),
            },
            # Aditya's Developer series
            {
                "title": "Why We Need Personal Websites Again",
                "excerpt": "Reclaiming the open web from social media silos, one HTML file at a time.",
                "content": (
                    "# Why We Need Personal Websites Again\n\n"
                    "In the early 2000s, the web was a collection of bizarre, beautiful, personal homepages. Then came social networks, which standardized our profiles into neat blue boxes and chronological feeds. We traded individuality for convenience.\n\n"
                    "## Reclaiming Your Digital Real Estate\n\n"
                    "A personal website is the only place on the internet that you fully control. There are no algorithms filtering your words, no ads surrounding your text, and no layout limitations. You can make it as minimal or as extravagant as you want.\n\n"
                    "- **It's a playground**: Experiment with weird layouts, CSS filters, and custom micro-interactions.\n"
                    "- **It's a digital archive**: Your thoughts remain accessible years later, instead of getting buried under a feed.\n"
                    "- **It's an ownership statement**: You own your content, your domain, and your distribution.\n\n"
                    "Let's make the web weird, personal, and human again."
                ),
                "icon": "💻",
                "author": users["aditya"],
                "category": categories["Technology"],
                "series": series_map["The Minimalist Developer"],
                "season": season_map["The Minimalist Developer"][1],
                "episode_number": 1,
                "post_type": "blog",
                "status": "published",
                "is_featured": True,
                "read_time": 5,
                "views_count": 512,
                "likes_count": 182,
                "gradient": "linear-gradient(135deg, rgba(129, 236, 236, 0.2), rgba(102, 217, 239, 0.1))",
                "published_at": now - timedelta(days=6),
            },
            # Aisha's Culture and Opinion blogs (no series)
            {
                "title": "The Art of Slow Thinking",
                "excerpt": "In a world of hot takes, how do we cultivate deep, deliberate reflections?",
                "content": (
                    "# The Art of Slow Thinking\n\n"
                    "We are encouraged to react instantly. A piece of news breaks, and within minutes, the internet is flooded with opinion threads, quote retweets, and hasty analyses. But deep understanding takes time.\n\n"
                    "## The Speed Trap\n\n"
                    "When we react instantly, we rely on our System 1 thinking—intuitive, emotional, and prone to cognitive bias. System 2 thinking, which is analytical and slow, requires conscious effort and silence.\n\n"
                    "### Cultivating a Slow Mindset\n\n"
                    "- **Wait 24 hours**: Before writing or commenting on a current event, let it digest for a day.\n"
                    "- **Read books, not just threads**: Long-form literature forces your brain to follow sustained arguments.\n"
                    "- **Embrace 'I don't know'**: It is perfectly fine to have no immediate opinion on a complex topic.\n\n"
                    "Wisdom is rarely found in speed. It is found in deliberate, slow contemplation."
                ),
                "icon": "⏳",
                "author": users["aisha"],
                "category": categories["Opinion"],
                "series": None,
                "season": None,
                "post_type": "blog",
                "status": "published",
                "is_featured": True,
                "read_time": 6,
                "views_count": 425,
                "likes_count": 139,
                "gradient": "linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 64, 129, 0.1))",
                "published_at": now - timedelta(days=3),
            },
            {
                "title": "The Quiet Rebellion of Letter Writing",
                "excerpt": "A reflection on the tactility, patience, and intimacy of physical letters in a digital world.",
                "content": (
                    "# The Quiet Rebellion of Letter Writing\n\n"
                    "Sending a physical letter is an act of trust. You write words on paper, seal them in an envelope, stick a stamp on it, and drop it into a box. You have no double-blue ticks to show it was read, and no instant replies. You just wait.\n\n"
                    "## The Tactility of Thought\n\n"
                    "The ink bleeding into paper, the texture of the envelope, the handwriting that shifts depending on your mood—these physical details add layers of meaning that a text message can never convey. A letter is a physical artifact of a specific moment in your life.\n\n"
                    "Next time you want to connect deeply with someone, don't send an email. Write a letter. It is a gift of your time, attention, and presence."
                ),
                "icon": "✉️",
                "author": users["aisha"],
                "category": categories["Culture"],
                "series": None,
                "season": None,
                "post_type": "blog",
                "status": "published",
                "is_featured": False,
                "read_time": 5,
                "views_count": 134,
                "likes_count": 41,
                "gradient": "linear-gradient(135deg, rgba(255, 138, 101, 0.2), rgba(255, 179, 71, 0.1))",
                "published_at": now - timedelta(days=1),
            },
            # Demo User post (to show demo user has some articles)
            {
                "title": "A Quiet Technology",
                "excerpt": "Building tools that disappear so stories can stay in focus.",
                "content": (
                    "# A Quiet Technology\n\n"
                    "Reflections on technology that supports creativity without demanding attention. We believe tools should stay in the background, serving our focus rather than interrupting it.\n\n"
                    "## Designing for Quietness\n\n"
                    "When we build interfaces, we must remember that attention is the most scarce resource. A quiet app doesn't push notifications every hour. It respects the user's intent and boundaries."
                ),
                "icon": "💡",
                "author": users["demo"],
                "category": categories["Technology"],
                "series": None,
                "season": None,
                "post_type": "blog",
                "status": "published",
                "is_featured": False,
                "read_time": 4,
                "views_count": 87,
                "likes_count": 18,
                "gradient": "linear-gradient(135deg, rgba(163, 203, 255, 0.2), rgba(108, 156, 255, 0.1))",
                "published_at": now - timedelta(days=2),
            },
            
            # JOURNALS (Personal/Reflective daily thoughts)
            {
                "title": "Morning Coffee & Code Architecture",
                "excerpt": "Early morning thoughts on clean abstractions, codebase size, and single-responsibility components.",
                "content": (
                    "There's a window of about 45 minutes between waking up and the rest of the world starting to ping you. That's when code architecture feels simple.\n\n"
                    "Today I'm refactoring a small service layer. The temptation is always to build for the future—to add hooks and abstract classes for features we 'might' need in six months. But experience has taught me that code is much easier to write than it is to delete. The best abstraction is often no abstraction at all, until the code screams for it."
                ),
                "icon": "☕",
                "author": users["aditya"],
                "category": categories["Personal"],
                "series": None,
                "season": None,
                "post_type": "journal",
                "status": "published",
                "is_featured": True,
                "read_time": 3,
                "views_count": 180,
                "likes_count": 72,
                "gradient": "linear-gradient(135deg, rgba(129, 236, 236, 0.2), rgba(102, 217, 239, 0.1))",
                "published_at": now - timedelta(hours=5),
            },
            {
                "title": "Rainy Day in Prague",
                "excerpt": "Reflections on finding quiet comfort in a warm cafe while rain falls on old city streets.",
                "content": (
                    "It has been raining since dawn. The cobblestones outside the cafe window are gleaming like wet coal. I've been sitting here with a single cup of black coffee, watching people rush by under colorful umbrellas.\n\n"
                    "Sometimes the weather gives you permission to slow down. There's no pressure to explore, no need to photograph. Just the warm aroma of cinnamon, the scratch of a pen on paper, and the soft patter of rain against glass. Prague is beautiful when it's sunny, but it's magical when it rains."
                ),
                "icon": "🌧️",
                "author": users["elena"],
                "category": categories["Personal"],
                "series": None,
                "season": None,
                "post_type": "journal",
                "status": "published",
                "is_featured": True,
                "read_time": 3,
                "views_count": 95,
                "likes_count": 42,
                "gradient": "linear-gradient(135deg, rgba(99, 221, 190, 0.2), rgba(76, 175, 215, 0.1))",
                "published_at": now - timedelta(days=1),
            },
            {
                "title": "Pixel Perfection is a Trap",
                "excerpt": "A designer's reminder that shipping something useful is better than polishing an unused interface.",
                "content": (
                    "Spent three hours today tweaking shadows on a button that most users will click in less than a millisecond. It's a classic designer trap: focusing on micro-details to avoid the hard macro-questions of usability and user flow.\n\n"
                    "I had to force myself to close Figma, open the code repository, and start building the real component. Perfect is the enemy of done, especially in product design. If it works, if it helps, ship it. You can always polish the shadow in the next pull request."
                ),
                "icon": "📐",
                "author": users["marcus"],
                "category": categories["Personal"],
                "series": None,
                "season": None,
                "post_type": "journal",
                "status": "published",
                "is_featured": False,
                "read_time": 3,
                "views_count": 112,
                "likes_count": 49,
                "gradient": "linear-gradient(135deg, rgba(181, 169, 255, 0.2), rgba(120, 88, 255, 0.1))",
                "published_at": now - timedelta(days=2),
            },
            {
                "title": "Dakar's Golden Hour",
                "excerpt": "Notes on colors, music, and the beautiful sense of community as evening falls.",
                "content": (
                    "Dakar does not ease into evening; it explodes into it. As the sun dips below the horizon, the sky turns a brilliant shade of dusty orange and deep purple. The sound of children playing football in the street mixes with the distant rhythm of drumming and the smell of grilled fish.\n\n"
                    "Sitting on my balcony, I feel a deep connection to this place. In the West, we build walls to protect our privacy. Here, life is lived in the open, in the shared space of the street. It is loud, it is chaotic, and it is beautiful."
                ),
                "icon": "🌅",
                "author": users["aisha"],
                "category": categories["Personal"],
                "series": None,
                "season": None,
                "post_type": "journal",
                "status": "published",
                "is_featured": False,
                "read_time": 3,
                "views_count": 86,
                "likes_count": 31,
                "gradient": "linear-gradient(135deg, rgba(255, 138, 101, 0.2), rgba(255, 179, 71, 0.1))",
                "published_at": now - timedelta(days=3),
            },
            {
                "title": "Solitude in a Digital Age",
                "excerpt": "Reflections on turning off notifications and embracing the quiet space of reading and writing alone.",
                "content": (
                    "We have forgotten how to be alone. If we have a spare ten seconds in an elevator or waiting in line, we pull out our phones. We fill every crack in our day with noise.\n\n"
                    "Today, I left my phone in another room for four hours. The first hour was marked by a twitchy, phantom-vibration anxiety. The second hour was quiet. By the third hour, I was reading a book with a depth of focus I hadn't felt in months. Solitude isn't loneliness; it is the space where your own thoughts can finally catch up with you."
                ),
                "icon": "🧘",
                "author": users["aditya"],
                "category": categories["Personal"],
                "series": None,
                "season": None,
                "post_type": "journal",
                "status": "published",
                "is_featured": False,
                "read_time": 4,
                "views_count": 142,
                "likes_count": 64,
                "gradient": "linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 64, 129, 0.1))",
                "published_at": now - timedelta(days=4),
            }
        ]

        posts_objects = []
        for p_data in post_data:
            post = Post.objects.create(**p_data)
            posts_objects.append(post)
        self.stdout.write(f"Created {len(posts_objects)} posts successfully.")

        # 5. Events
        today = date.today()
        event_data = [
            {
                "title": "Mindful Coding: Building Clean Systems",
                "description": (
                    "A 90-minute workshop on reducing code complexity, focusing on readability, "
                    "and constructing solid software architectures that stand the test of time.\n\n"
                    "We'll cover:\n"
                    "- The cost of premature abstractions\n"
                    "- Refactoring techniques for modular systems\n"
                    "- Designing clean API contracts\n"
                    "- Open Q&A and code review session"
                ),
                "event_type": "workshop",
                "date": today + timedelta(days=10),
                "time": time(17, 0),
                "end_time": time(18, 30),
                "location": "Online (Google Meet)",
                "is_virtual": True,
                "price": 0.00,
                "is_free": True,
                "max_attendees": 100,
                "attendees_count": 48,
                "gradient": "linear-gradient(135deg, rgba(129, 236, 236, 0.2), rgba(102, 217, 239, 0.1))",
                "accent_color": "#81ecec",
                "organizer": users["aditya"],
            },
            {
                "title": "Creative Travel Writing Masterclass",
                "description": (
                    "Join photojournalist and essayist Elena Rostova for an immersive masterclass "
                    "on capturing the essence of local cultures and writing captivating travel essays.\n\n"
                    "Highlights include:\n"
                    "- Sensory journaling exercises\n"
                    "- Developing a unique narrator voice\n"
                    "- Editing and formatting long-form travelogues\n"
                    "- Individual feedback on your writing samples"
                ),
                "event_type": "masterclass",
                "date": today + timedelta(days=18),
                "time": time(18, 0),
                "end_time": time(20, 0),
                "location": "Cafe Slavia, Prague & Zoom Link",
                "is_virtual": True,
                "price": 25.00,
                "is_free": False,
                "max_attendees": 25,
                "attendees_count": 12,
                "gradient": "linear-gradient(135deg, rgba(99, 221, 190, 0.2), rgba(76, 175, 215, 0.1))",
                "accent_color": "#63ddbe",
                "organizer": users["elena"],
            },
            {
                "title": "Aesthetics in Spatial UI Design",
                "description": (
                    "A local meetup for designers and developers in Stockholm to discuss the transition "
                    "from screen layouts to three-dimensional environments, spatial depth, and interactive light.\n\n"
                    "Bring your portfolio or prototypes to show and get real feedback from senior designers!"
                ),
                "event_type": "meetup",
                "date": today + timedelta(days=30),
                "time": time(19, 0),
                "location": "Stockholm Innovation Lab (Room B)",
                "is_virtual": False,
                "price": 10.00,
                "is_free": False,
                "max_attendees": 40,
                "attendees_count": 28,
                "gradient": "linear-gradient(135deg, rgba(181, 169, 255, 0.2), rgba(120, 88, 255, 0.1))",
                "accent_color": "#b5a9ff",
                "organizer": users["marcus"],
            },
            {
                "title": "Dakar Cultural Storytelling Meetup",
                "description": (
                    "Gathering at the National Gallery in Dakar to share personal essays, poems, "
                    "and stories about heritage, transformation, and our digital future.\n\n"
                    "Free entry. Tea and snacks will be served."
                ),
                "event_type": "meetup",
                "date": today + timedelta(days=35),
                "time": time(16, 0),
                "location": "National Gallery, Dakar",
                "is_virtual": False,
                "price": 0.00,
                "is_free": True,
                "max_attendees": 50,
                "attendees_count": 35,
                "gradient": "linear-gradient(135deg, rgba(255, 138, 101, 0.2), rgba(255, 179, 71, 0.1))",
                "accent_color": "#ff8a65",
                "organizer": users["aisha"],
            }
        ]

        events_objects = []
        for e_data in event_data:
            event = Event.objects.create(**e_data)
            events_objects.append(event)
        self.stdout.write(f"Created {len(events_objects)} events successfully.")

        # 6. Comments & Likes (Interaction)
        comments_pool = [
            "This is incredibly beautiful! I love the phrasing here.",
            "Wow, this is a masterclass in clean styling and storytelling.",
            "Fully agree with the point on System 2 thinking. We need to slow down.",
            "Thank you for sharing this. It really makes me think about my own workflows.",
            "Excellent article! Can't wait for the next episode in this series.",
            "Resonates deeply. Modern tech really has lost some of its soul.",
            "So inspiring! The Prague description makes me want to pack my bags right now."
        ]

        all_users = list(users.values())

        # Add random comments to published posts
        for post in posts_objects:
            # Add 2-4 comments per post
            num_comments = random.randint(2, 4)
            chosen_users = random.sample(all_users, num_comments)
            for user in chosen_users:
                content = random.choice(comments_pool)
                Comment.objects.create(
                    post=post,
                    author=user,
                    content=content
                )

            # Add likes
            num_likes = random.randint(1, len(all_users))
            likers = random.sample(all_users, num_likes)
            for user in likers:
                Like.objects.get_or_create(post=post, user=user)

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully with interactions."))
