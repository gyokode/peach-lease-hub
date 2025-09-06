import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  housingAdId?: string;
  images: Array<{
    id?: string;
    image_url: string;
    image_path?: string;
    caption?: string;
    display_order: number;
  }>;
  onImagesChange: (images: any[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ housingAdId, images, onImagesChange, maxImages = 10 }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `housing/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('housing-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('housing-images')
        .getPublicUrl(filePath);

      return {
        image_url: publicUrl,
        image_path: filePath,
        display_order: images.length
      };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(uploadImage);
      const uploadResults = await Promise.all(uploadPromises);
      const validUploads = uploadResults.filter(result => result !== null);

      if (validUploads.length > 0) {
        if (housingAdId) {
          // If we have a housing ad ID, save to database
          const { data, error } = await supabase
            .from('housing_images')
            .insert(
              validUploads.map(upload => ({
                housing_ad_id: housingAdId,
                ...upload
              }))
            )
            .select();

          if (error) throw error;
          onImagesChange([...images, ...data]);
        } else {
          // If no housing ad ID, just update local state
          onImagesChange([...images, ...validUploads]);
        }

        toast({
          title: "Images uploaded",
          description: `${validUploads.length} image(s) uploaded successfully`,
        });
      }
    } catch (error: any) {
      console.error('Error saving images:', error);
      toast({
        title: "Save failed",
        description: "Failed to save image information",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (imageIndex: number) => {
    const imageToRemove = images[imageIndex];
    
    try {
      if (imageToRemove.id && housingAdId) {
        // Remove from database if it has an ID
        const { error } = await supabase
          .from('housing_images')
          .delete()
          .eq('id', imageToRemove.id);

        if (error) throw error;
      }

      // Remove from storage if we have the path
      if (imageToRemove.image_path || imageToRemove.image_url.includes('supabase')) {
        const path = imageToRemove.image_path || 
          imageToRemove.image_url.split('/').slice(-2).join('/');
        
        await supabase.storage
          .from('housing-images')
          .remove([path]);
      }

      // Update local state
      const updatedImages = images.filter((_, index) => index !== imageIndex);
      onImagesChange(updatedImages);

      toast({
        title: "Image removed",
        description: "Image has been deleted successfully",
      });
    } catch (error: any) {
      console.error('Error removing image:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const updateCaption = async (imageIndex: number, caption: string) => {
    const updatedImages = [...images];
    updatedImages[imageIndex] = { ...updatedImages[imageIndex], caption };
    
    if (updatedImages[imageIndex].id && housingAdId) {
      try {
        const { error } = await supabase
          .from('housing_images')
          .update({ caption })
          .eq('id', updatedImages[imageIndex].id);

        if (error) throw error;
      } catch (error: any) {
        console.error('Error updating caption:', error);
        toast({
          title: "Update failed",
          description: "Failed to update image caption",
          variant: "destructive",
        });
        return;
      }
    }

    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Property Images ({images.length}/{maxImages})</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload photos of your property. High-quality images help attract potential tenants.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {images.map((image, index) => (
            <Card key={index} className="p-4">
              <div className="relative">
                <img
                  src={image.image_url}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                <Input
                  placeholder="Add a caption (optional)"
                  value={image.caption || ''}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  className="text-sm"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <div className="p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="mb-4">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            </div>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mb-2"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Images'}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG up to 5MB each
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;