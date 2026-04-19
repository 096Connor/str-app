import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: createMovieDto,
    });
  }

  async findAll(genre?: string, search?: string) {
    const where: any = {};

    if (genre) {
      where.genre = { has: genre };
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.movie.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.findOne(id);
    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.movie.delete({
      where: { id },
    });
  }

  async seedMovies() {
    const movies = [
      {
        title: 'The Shawshank Redemption',
        description:
          'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        releaseYear: 1994,
        duration: 142,
        genre: ['Drama', 'Crime'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        videoUrl: '/videos/movie1.mp4',
        rating: 9.3,
      },
      {
        title: 'The Godfather',
        description:
          'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        releaseYear: 1972,
        duration: 175,
        genre: ['Crime', 'Drama'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        videoUrl: '/videos/movie2.mp4',
        rating: 9.2,
        isPremium: true,
      },
      {
        title: 'The Dark Knight',
        description:
          'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        releaseYear: 2008,
        duration: 152,
        genre: ['Action', 'Crime', 'Drama'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        videoUrl: '/videos/movie3.mp4',
        rating: 9.0,
      },
      {
        title: 'Pulp Fiction',
        description:
          'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        releaseYear: 1994,
        duration: 154,
        genre: ['Crime', 'Drama'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        videoUrl: '/videos/movie4.mp4',
        rating: 8.9,
      },
      {
        title: 'Forrest Gump',
        description:
          'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        releaseYear: 1994,
        duration: 142,
        genre: ['Drama', 'Romance'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
        videoUrl: '/videos/movie5.mp4',
        rating: 8.8,
        isPremium: true,
      },
      {
        title: 'Inception',
        description:
          'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        releaseYear: 2010,
        duration: 148,
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        videoUrl: '/videos/movie6.mp4',
        rating: 8.8,
      },
      {
        title: 'The Matrix',
        description:
          'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        releaseYear: 1999,
        duration: 136,
        genre: ['Action', 'Sci-Fi'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        videoUrl: '/videos/movie7.mp4',
        rating: 8.7,
      },
      {
        title: 'Interstellar',
        description:
          "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseYear: 2014,
        duration: 169,
        genre: ['Adventure', 'Drama', 'Sci-Fi'],
        thumbnail:
          'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        videoUrl: '/videos/movie8.mp4',
        rating: 8.6,
      },
    ];

    let count = 0;
    for (const movie of movies) {
      const existing = await this.prisma.movie.findFirst({
        where: { title: movie.title },
      });

      if (!existing) {
        await this.prisma.movie.create({ data: movie });
        count++;
      }
    }

    return { message: `Seeded ${count} new movies`, total: movies.length };
  }
  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    // Pobierz gatunki z historii oglądania
    const history = await this.prisma.watchHistory.findMany({
      where: { userId },
      include: { movie: true },
      take: 10,
    });

    if (history.length === 0) return [];

    // Zbierz wszystkie gatunki z historii
    const genres = history.flatMap((item) => item.movie.genre);
    const genreCount = genres.reduce(
      (acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Posortuj gatunki po częstości
    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    // ID filmów już oglądanych
    const watchedIds = history.map((item) => item.movieId);

    // Znajdź filmy z tych gatunków których jeszcze nie oglądał
    return this.prisma.movie.findMany({
      where: {
        id: { notIn: watchedIds },
        genre: { hasSome: topGenres },
        ...(user?.isSubscribed ? {} : { isPremium: false }),
      },
      orderBy: { rating: 'desc' },
      take: 10,
    });
  }
}
