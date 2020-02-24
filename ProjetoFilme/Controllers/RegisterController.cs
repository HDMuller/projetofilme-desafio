using ProjetoFilme.Data;
using ProjetoFilme.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjetoFilme.Controllers
{
    public class RegisterController : ApiController
    {
        DataDbContext dataDbContext = new DataDbContext();

        // POST api/register
        // Método utilizado para registrar um novo usuário e senha
        // Passando a entidade User a ser salva no banco
        public IHttpActionResult Post([FromBody]User entity)
        {
            dataDbContext.Users.Add(entity);
            dataDbContext.SaveChanges();
            return StatusCode(HttpStatusCode.Created);
        }

        // PUT api/register
        // Método utilizado para autenticar o usuário e senha informados no momento do Login
        public IHttpActionResult Put([FromBody]User value)
        {
            var entity = dataDbContext.Users.FirstOrDefault(q => q.Username == value.Username && q.Password == value.Password);
            if (entity == null)
            {
                return StatusCode(HttpStatusCode.Unauthorized);
            }
            return Ok("Autenticado");
        }
    }
}
