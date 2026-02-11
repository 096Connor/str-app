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

    // Filtrowanie po gatunku
    if (genre) {
      where.genre = {
        has: genre,
      };
    }

    // Wyszukiwanie po tytule
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.movie.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
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
    // Sprawdź czy film istnieje
    await this.findOne(id);

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async remove(id: string) {
    // Sprawdź czy film istnieje
    await this.findOne(id);

    return this.prisma.movie.delete({
      where: { id },
    });
  }

  // Pomocnicza funkcja do seedowania danych
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
        videoUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
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
        videoUrl: 'https://www.youtube.com/watch?v=sY1S34973zA',
        rating: 9.2,
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
        videoUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
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
        videoUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
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
        videoUrl: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
        rating: 8.8,
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
        videoUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
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
        videoUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
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
        videoUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        rating: 8.6,
      },
    ];

    let count = 0;
    for (const movie of movies) {
      // Sprawdź czy film już istnieje
      const existing = await this.prisma.movie.findFirst({
        where: { title: movie.title },
      });

      if (!existing) {
        await this.prisma.movie.create({
          data: movie,
        });
        count++;
      }
    }

    return { message: `Seeded ${count} new movies`, total: movies.length };
  }
}
