from FlagEmbedding import FlagAutoModel

model = FlagAutoModel.from_finetuned('BAAI/bge-base-en-v1.5',
                                      query_instruction_for_retrieval="Represent this sentence for searching relevant passages:",
                                      use_fp16=True)


sentences_1 = ["I love NLP"]
sentences_2 = ["I love BGE"]
embeddings_1 = model.encode(sentences_1)
embeddings_2 = model.encode(sentences_2)

print(embeddings_1.shape)
print(embeddings_1@embeddings_2.T)

# from openai import OpenAI
# import pandas as pd
# client = OpenAI()

# def get_embedding(text, model="text-embedding-3-small"):
#     text = text.replace("\n", " ")
#     return client.embeddings.create(input = [text], model=model).data[0].embedding

# df =  pd.DataFrame([{"text":"the cat is on the mat"}])
# df['ada_embedding'] = df['text'].apply(lambda x: get_embedding(x, model='text-embedding-3-small'))
# df.to_csv('output/embedded_1k_reviews.csv', index=False)
