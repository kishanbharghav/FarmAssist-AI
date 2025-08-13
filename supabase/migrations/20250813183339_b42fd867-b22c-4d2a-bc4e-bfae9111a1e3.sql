-- Create table for storing farming datasets
CREATE TABLE public.farming_datasets (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'csv',
  columns TEXT[] NOT NULL,
  data JSONB NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.farming_datasets ENABLE ROW LEVEL SECURITY;

-- Create policies for dataset access (allowing public access for now since no auth yet)
CREATE POLICY "Allow public access to farming datasets" 
ON public.farming_datasets 
FOR ALL
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_farming_datasets_updated_at
  BEFORE UPDATE ON public.farming_datasets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_farming_datasets_name ON public.farming_datasets(name);
CREATE INDEX idx_farming_datasets_type ON public.farming_datasets(type);
CREATE INDEX idx_farming_datasets_created_at ON public.farming_datasets(created_at);