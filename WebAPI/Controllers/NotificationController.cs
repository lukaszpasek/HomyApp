using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> SendPushNotificationAsync([FromBody] PushNotificationRequest request)
        {
            try
            {
                FirebaseApp firebaseApp = FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("../serviceAccountKey.json")
                });

                // Inicjalizacja usługi Firebase Cloud Messaging
                var messaging = FirebaseMessaging.GetMessaging(firebaseApp);

                // Tworzenie wiadomości powiadomienia
                var message = new Message()
                {
                    Notification = new Notification
                    {
                        Title = request.Title,
                        Body = request.Body
                    },
                    Token = request.DeviceToken
                };

                // Wysyłanie powiadomienia
                var response = await messaging.SendAsync(message);

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }

    public class PushNotificationRequest
    {
        public string DeviceToken { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}