from google import genai
key = "AIzaSyDqw6szYVBlyc_TG30yGFMCWGznoTpTayw"
myModel = "gemini-2.5-flash"

ai = genai.Client(api_key=key)

while True :

    question = input("user: ")
    if question == "bye":
           print("AI : Thank you")
           break
    answer = ai.models.generate_content(
        model = myModel, contents = question
    )
    print("Ai : ", answer.text)