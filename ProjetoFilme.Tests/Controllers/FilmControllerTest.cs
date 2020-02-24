using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProjetoFilme.Controllers;
using ProjetoFilme.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Results;

namespace ProjetoFilme.Tests.Controllers
{
    [TestClass]
    public class FilmControllerTest
    {
        Film film = new Film
        {
            ID = 1,
            Nome = "Filme do Teste Get ID",
            Ativo = true,
            GeneroID = 1
        };

        Film film2 = new Film
        {
            ID = 2,
            Nome = "Filme do Teste Delete",
            Ativo = true,
            GeneroID = 1
        };

        Film film3 = new Film
        {
            ID = 3,
            Nome = "Filme do Teste Get 3",
            Ativo = true,
            GeneroID = 1
        };

        Film film4 = new Film
        {
            ID = 4,
            Nome = "Filme do Teste Get 4",
            Ativo = true,
            GeneroID = 1
        };

        Film film5 = new Film
        {
            ID = 5,
            Nome = "Filme do Teste Get 4",
            Ativo = false,
            GeneroID = 1
        };

        [TestInitialize]
        public void Initialize()
        {
            // Cria primeiro o gênero de Teste
            var genresController = new GenresController();
            var genre = new Genre
            {
                ID = 1,
                Nome = "Gênero de Teste",
                Ativo = true
            };
            genresController.Post(genre);
        }

        //Como este teste depende da quantidade de itens que estão salvos no banco, sempre que for executado o teste, caso exista um banco de teste, ele deve ser deletado
        [TestMethod]
        public void ShouldGetFilms()
        {
            FilmsController controller = new FilmsController();

            controller.Post(film);
            controller.Post(film2);
            controller.Post(film3);
            controller.Post(film4);
            controller.Post(film5);

            var result = controller.Get(false) as OkNegotiatedContentResult<List<Film>>;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Content);
            Assert.AreEqual(5, result.Content.Count());
        }

        [TestMethod]
        public void ShouldGetFilmsAtivo()
        {
            FilmsController controller = new FilmsController();

            var result = controller.Get(true) as OkNegotiatedContentResult<List<Film>>;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Content);
            Assert.AreEqual(4, result.Content.Count());
        }

        [TestMethod]
        public void ShouldGetFilm()
        {
            FilmsController controller = new FilmsController();

            var result = controller.Get(1) as OkNegotiatedContentResult<Film>;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Content);
            Assert.AreEqual("Filme do Teste Get ID", result.Content.Nome);
        }

        [TestMethod]
        public void ShouldPostFilm()
        {
            FilmsController controller = new FilmsController();

            var newFilm = new Film() { Nome = "Filme do Teste POST", Ativo = true, GeneroID = 1 };

            controller.Post(newFilm);

            var result = controller.Get(6) as OkNegotiatedContentResult<Film>;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Content);
            Assert.AreEqual("Filme do Teste POST", result.Content.Nome);
            Assert.AreEqual(true, result.Content.Ativo);
        }

        [TestMethod]
        public void ShouldPutFilm()
        {
            FilmsController controller = new FilmsController();

            var newFilm = new Film() { ID = 6, Nome = "Filme do Teste PUT", Ativo = false, GeneroID = 1 };

            controller.Put(newFilm.ID, newFilm);

            var result = controller.Get(6) as OkNegotiatedContentResult<Film>;

            Assert.IsNotNull(result);
            Assert.IsNotNull(result.Content);
            Assert.AreEqual("Filme do Teste PUT", result.Content.Nome);
            Assert.AreEqual(false, result.Content.Ativo);
        }

        [TestMethod]
        public void ShouldDeleteFilm()
        {
            FilmsController controller = new FilmsController();

            controller.Delete(2);

            var result = controller.Get(2) as OkNegotiatedContentResult<Film>;

            Assert.IsNull(result);           
        }
    }
}
